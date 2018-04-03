import { EnvironmentService } from './environment.service'
import { Inject, Injectable, InjectionToken } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import { sha1 } from 'object-hash'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { CookieService } from './cookie.service'
import { makeStateKey } from '@angular/platform-browser'
import { Subscription } from 'rxjs/Subscription'
import { Router } from '@angular/router'
import { distinctUntilChanged, flatMap, map, shareReplay } from 'rxjs/operators'
import { of } from 'rxjs/observable/of'
import { timer } from 'rxjs/observable/timer'
import { HttpClient } from '@angular/common/http'
import { AngularFireAuth } from 'angularfire2/auth'
import * as auth0 from 'auth0-js'
import { fromPromise } from 'rxjs/observable/fromPromise'

export type IAuth0ValidationFactory = (
  accessToken?: string,
  idToken?: string
) => Observable<auth0.Auth0UserProfile | undefined>

export const AUTH0_CLIENT = new InjectionToken('cfg.auth0.client')
export const AUTH_ROLES_KEY = new InjectionToken<string>('cfg.auth0.role.key')
export const AUTH0_VALIDATION_FACTORY = new InjectionToken<
  IAuth0ValidationFactory
>('cfg.auth0.validation')
export const AUTH_ID_TOKEN_STORAGE_KEY = new InjectionToken<string>(
  'cfg.auth.sto.id.tkn.key'
)
export const AUTH_ACCESS_TOKEN_STORAGE_KEY = new InjectionToken<string>(
  'cfg.auth.sto.access.tkn.key'
)
export const AUTH_ACCESS_TOKEN_EXPIRY_STORAGE_KEY = new InjectionToken<string>(
  'cfg.auth.sto.access.tkn.exp.key'
)
export const AUTH_REFRESH_TOKEN_STORAGE_KEY = new InjectionToken<string>(
  'cfg.auth.sto.fresh.key'
)
export const AUTH_CALLBACK_FACTORY = new InjectionToken<any>('cfg.auth.cb')

export const AUTH0_USER_TRANSFER = makeStateKey('cfg.auth0.user.ts')

export function authZeroFactory(es: EnvironmentService) {
  return new auth0.WebAuth(es.config.auth0 as any)
}

export function rolesKeyFactory(es: EnvironmentService) {
  return es.config.rolesKey
}

export interface ExtendedUser extends auth0.Auth0UserProfile {
  readonly roles?: { readonly [key: string]: boolean }
}

@Injectable()
export class AuthService {
  constructor(
    private cs: CookieService,
    @Inject(AUTH0_CLIENT) private az: auth0.WebAuth,
    @Inject(AUTH_ROLES_KEY) private rolesKey: string,
    @Inject(AUTH_ID_TOKEN_STORAGE_KEY) private idTokenStorageKey: string,
    @Inject(AUTH_ACCESS_TOKEN_STORAGE_KEY)
    private accessTokenStorageKey: string,
    @Inject(AUTH_ACCESS_TOKEN_EXPIRY_STORAGE_KEY)
    private accessTokenExpiryStorageKey: string,
    @Inject(AUTH0_VALIDATION_FACTORY)
    private validationFactory: IAuth0ValidationFactory,
    private router: Router,
    private http: HttpClient,
    private afAuth: AngularFireAuth
  ) {
    cs.valueChanges
      .pipe(map(a => a[this.accessTokenStorageKey]))
      .subscribe(user => this.accessTokenSource.next(user))
  }

  // tslint:disable-next-line:readonly-keyword
  private refreshSubscription = new Subscription()

  private readonly accessTokenSource = new BehaviorSubject<string | undefined>(
    this.cs.get(this.accessTokenStorageKey)
  )

  private readonly accessToken$ = this.accessTokenSource.pipe(
    distinctUntilChanged()
  )

  public readonly user$ = this.accessToken$.pipe(
    flatMap(accessToken => this.getUserProfile(accessToken)),
    distinctUntilChanged((x, y) => (x && sha1(x)) === (y && sha1(y))),
    shareReplay(1)
  )

  public readonly isLoggedIn$ = this.user$.pipe(
    map(user => (user ? true : false))
  )
  public readonly isLoggedOut$ = this.isLoggedIn$.pipe(map(a => !a))

  public login(): void {
    this.az.authorize()
  }

  public logout(redirect = '/'): void {
    this.cs.remove(this.accessTokenStorageKey)
    this.cs.remove(this.idTokenStorageKey)
    this.cs.remove(this.accessTokenExpiryStorageKey)
    this.unscheduleRenewal()
    redirect && this.router.navigate([redirect])
  }

  public handleAuthentication(): void {
    this.az.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult)
        this.router.navigate(['/'])
      } else if (err) {
        this.router.navigate(['/'])
      }
    })
  }

  public renewToken() {
    this.az.checkSession({}, (err, result) => {
      !err && this.setSession(result)
    })
  }

  public getValidToken(): string | undefined {
    const token = this.cs.get(this.accessTokenStorageKey)
    return this.isTokenValid() && token
  }

  public getCustomFirebaseToken(): string | undefined {
    return this.cs.get('fbAuth')
  }

  public unscheduleRenewal() {
    this.refreshSubscription.unsubscribe()
  }

  public scheduleRenewal() {
    if (!this.isTokenValid()) return
    this.unscheduleRenewal()

    const expires = this.cs.get(this.accessTokenExpiryStorageKey)

    const source = of(expires).pipe(
      flatMap(expiresAt => {
        return timer(Math.max(1, expiresAt - Date.now()))
      })
    )

    // tslint:disable-next-line:no-object-mutation
    this.refreshSubscription = source.subscribe(() => {
      this.renewToken()
      this.scheduleRenewal()
    })
  }

  public isTokenValid(): boolean {
    const token = this.cs.get(this.accessTokenStorageKey)
    const expiresAt = this.cs.get(this.accessTokenExpiryStorageKey)
    return token && Date.now() < expiresAt
  }

  private getUserProfile(
    accessToken?: string
  ): Observable<ExtendedUser | undefined> {
    return this.validationFactory(
      accessToken,
      this.cs.get(this.idTokenStorageKey)
    ).pipe(
      map(user => {
        return (
          user && {
            ...user,
            roles: user && (user as any)[this.rolesKey]
          }
        )
      })
    )
  }

  private setSession(authResult: auth0.Auth0DecodedHash): void {
    if (!authResult.expiresIn) return

    const _expires = new Date().getTime() + authResult.expiresIn * 1000
    const expires = new Date(_expires)

    this.cs.set(this.accessTokenStorageKey, authResult.accessToken, { expires })
    this.cs.set(this.idTokenStorageKey, authResult.idToken, { expires })
    this.cs.set(this.accessTokenExpiryStorageKey, _expires, { expires })

    this.scheduleRenewal()
    this.getMintedTokenForFirebase().subscribe(us => {
      console.log(us)
      this.cs.set('fbAuth', us.qa)
    })
  }

  private getMintedTokenForFirebase() {
    return !this.isTokenValid()
      ? of(undefined)
      : this.http
          .get(`${'http://localhost:5000/'}api/auth/firebase`)
          .pipe(
            flatMap((token: { readonly firebaseToken: string }) =>
              this.firebaseAuth(token)
            )
          )
  }

  private firebaseAuth(tokenObj: { readonly firebaseToken: string }) {
    return fromPromise(
      this.afAuth.auth.signInWithCustomToken(tokenObj.firebaseToken)
    )
    // .then(res => {
    //   // tslint:disable-next-line:no-console
    //   console.log(res)
    //   // this.loggedInFirebase = true
    //   // Schedule token renewal
    //   // this.scheduleFirebaseRenewal()
    // })
    // .catch(err => {
    //   // const errorCode = err.code
    //   // const errorMessage = err.message
    //   // console.error(`${errorCode} Could not log into Firebase: ${errorMessage}`)
    //   // this.loggedInFirebase = false
    // }))
  }

  // scheduleFirebaseRenewal() {
  //   // If user isn't authenticated, check for Firebase subscription
  //   // and unsubscribe, then return (don't schedule renewal)
  //   if (!this.loggedInFirebase) {
  //     if (this.firebaseSub) {
  //       this.firebaseSub.unsubscribe();
  //     }
  //     return;
  //   }
  //   // Unsubscribe from previous expiration observable
  //   this.unscheduleFirebaseRenewal();
  //   // Create and subscribe to expiration observable
  //   // Custom Firebase tokens minted by Firebase
  //   // expire after 3600 seconds (1 hour)
  //   const expiresAt = new Date().getTime() + (3600 * 1000);
  //   const expiresIn$ = Observable.of(expiresAt)
  //     .pipe(
  //       mergeMap(
  //         expires => {
  //           const now = Date.now();
  //           // Use timer to track delay until expiration
  //           // to run the refresh at the proper time
  //           return Observable.timer(Math.max(1, expires - now));
  //         }
  //       )
  //     );

  //   this.refreshFirebaseSub = expiresIn$
  //     .subscribe(
  //       () => {
  //         console.log('Firebase token expired; fetching a new one');
  //         this._getFirebaseToken();
  //       }
  //     );
  // }

  // unscheduleFirebaseRenewal() {
  //   if (this.refreshFirebaseSub) {
  //     this.refreshFirebaseSub.unsubscribe();
  //   }
  // }
}
