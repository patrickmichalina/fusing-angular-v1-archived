import { Inject, Injectable, InjectionToken } from '@angular/core'
import { Router } from '@angular/router'
import { Observable } from 'rxjs/Observable'
import { sha1 } from 'object-hash'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { CookieService } from './cookie.service'
import { makeStateKey } from '@angular/platform-browser'
import { EnvironmentService } from './environment.service'
import {
  distinctUntilChanged,
  filter,
  flatMap,
  map,
  shareReplay,
  take
} from 'rxjs/operators'
import { of } from 'rxjs/observable/of'
import { HttpClient } from '@angular/common/http'
import { AngularFireAuth } from 'angularfire2/auth'
import { PlatformService } from './platform.service'
// tslint:disable-next-line:import-blacklist
import { timer } from 'rxjs'
import * as auth0 from 'auth0-js'

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

const FB_KEY = 'fbAuth'

@Injectable()
export class AuthService {
  readonly cookies$ = this.cs.valueChanges.pipe(shareReplay(1))

  constructor(
    @Inject(AUTH0_CLIENT) private az: auth0.WebAuth,
    @Inject(AUTH_ROLES_KEY) private rolesKey: string,
    @Inject(AUTH_ID_TOKEN_STORAGE_KEY) private idTokenStorageKey: string,
    @Inject(AUTH_ACCESS_TOKEN_STORAGE_KEY)
    private accessTokenStorageKey: string,
    @Inject(AUTH_ACCESS_TOKEN_EXPIRY_STORAGE_KEY)
    private accessTokenExpiryStorageKey: string,
    @Inject(AUTH0_VALIDATION_FACTORY)
    private validationFactory: IAuth0ValidationFactory,
    private cs: CookieService,
    private router: Router,
    private http: HttpClient,
    private afAuth: AngularFireAuth,
    private es: EnvironmentService,
    ps: PlatformService
  ) {
    if (ps.isServer) return

    this.fbToken$.pipe(filter(Boolean)).subscribe(token => {
      this.scheduleFirebaseRenewal()
    })

    this.accessToken$.pipe(filter(Boolean)).subscribe(token => {
      this.scheduleRenewal()
      this.fbIteration()
    })

    this.cookies$
      .pipe(map(a => a[this.accessTokenStorageKey]), distinctUntilChanged())
      .subscribe(user => this.accessTokenSource.next(user))
    this.cookies$
      .pipe(map(a => a[FB_KEY]), distinctUntilChanged())
      .subscribe(s => this.fbTokenSource.next(s))
  }

  private readonly accessTokenSource = new BehaviorSubject<string | undefined>(
    this.cs.get(this.accessTokenStorageKey)
  )
  private readonly fbTokenSource = new BehaviorSubject<string | undefined>(
    this.cs.get(FB_KEY)
  )

  private readonly accessToken$ = this.accessTokenSource.pipe(
    distinctUntilChanged(),
    shareReplay(1)
  )
  private readonly fbToken$ = this.fbTokenSource.pipe(
    distinctUntilChanged(),
    shareReplay(1)
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
    this.afAuth.auth.signOut().then(() => {
      this.cs.remove(this.accessTokenStorageKey)
      this.cs.remove(this.idTokenStorageKey)
      this.cs.remove(this.accessTokenExpiryStorageKey)
      this.cs.remove(FB_KEY)
      redirect && this.router.navigate([redirect])
    })
  }

  public handleAuthentication(): void {
    this.az.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult)
        this.fbIteration()
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
    return this.cs.get(FB_KEY)
  }

  public scheduleRenewal() {
    this.isTokenValid() &&
      of(this.cs.get(this.accessTokenExpiryStorageKey))
        .pipe(
          flatMap(expiresAt => {
            return timer(Math.max(1, expiresAt - Date.now()))
          }),
          take(1)
        )
        .subscribe(() => {
          this.renewToken()
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
  }

  private getMintedCustomTokenForFirebase() {
    return !this.isTokenValid()
      ? of(undefined)
      : this.http
          .get(`${this.es.config.siteUrl}/api/auth/firebase`)
          .pipe(
            flatMap((token: { readonly firebaseToken: string }) =>
              this.afAuth.auth.signInWithCustomToken(token.firebaseToken)
            )
          )
  }

  private setFirebaseSession(token: string) {
    this.cs.set(FB_KEY, token)
  }

  private fbIteration() {
    this.getMintedCustomTokenForFirebase()
      .pipe(filter(a => a && a.qa), take(1))
      .subscribe(t => this.setFirebaseSession(t.qa))
  }

  scheduleFirebaseRenewal() {
    timer(0, 3600 * 1000)
      .pipe(take(1))
      .subscribe(() => this.fbIteration())
  }
}
