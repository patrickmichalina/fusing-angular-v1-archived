import { Inject, Injectable, InjectionToken } from '@angular/core'
import { CookieService } from './cookie.service'
import {
  AUTH_ACCESS_TOKEN_EXPIRY_STORAGE_KEY,
  AUTH_ACCESS_TOKEN_STORAGE_KEY,
  AUTH_ID_TOKEN_STORAGE_KEY
} from '../auth/tokens'
import { Observable } from 'rxjs/Observable'
import { sha1 } from 'object-hash'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { EnvironmentService } from './environment.service'
import { makeStateKey } from '@angular/platform-browser'
import { Subscription } from 'rxjs/Subscription'
import * as auth0 from 'auth0-js'

export type IAuth0ValidationFactory = (
  accessToken?: string,
  idToken?: string
) => Observable<auth0.Auth0UserProfile | undefined>

export const AUTH0_CLIENT = new InjectionToken('cfg.auth0.client')
export const AUTH0_VALIDATION_FACTORY = new InjectionToken<
  IAuth0ValidationFactory
>('cfg.auth0.validation')
export const AUTH0_USER_TRANSFER = makeStateKey('cfg.auth0.user.ts')

export function authZeroFactory(es: EnvironmentService) {
  return new auth0.WebAuth(es.config.auth0 as any)
}

@Injectable()
export class AuthService {
  constructor(
    private cs: CookieService,
    @Inject(AUTH0_CLIENT) private az: auth0.WebAuth,
    @Inject(AUTH_ID_TOKEN_STORAGE_KEY) private idTokenStorageKey: string,
    @Inject(AUTH_ACCESS_TOKEN_STORAGE_KEY)
    private accessTokenStorageKey: string,
    @Inject(AUTH_ACCESS_TOKEN_EXPIRY_STORAGE_KEY)
    private accessTokenExpiryStorageKey: string,
    @Inject(AUTH0_VALIDATION_FACTORY)
    private validationFactory: IAuth0ValidationFactory
  ) {
    cs.valueChanges
      .map(a => a[this.accessTokenStorageKey])
      .subscribe(user => this.accessTokenSource.next(user))
  }

  // tslint:disable-next-line:readonly-keyword
  private refreshSubscription = new Subscription()

  private readonly accessTokenSource = new BehaviorSubject<string | undefined>(
    this.cs.get(this.accessTokenStorageKey)
  )

  private readonly accessToken$ = this.accessTokenSource
    .asObservable()
    .distinctUntilChanged()

  public readonly user$ = this.accessToken$
    .flatMap(accessToken => this.getUserProfile(accessToken))
    .distinctUntilChanged((x, y) => (x && sha1(x)) === (y && sha1(y)))
    .shareReplay(1)

  public readonly isLoggedIn$ = this.user$.map(user => (user ? true : false))
  public readonly isLoggedOut$ = this.isLoggedIn$.map(a => !a)

  public login(): void {
    this.az.authorize()
  }

  public logout(): void {
    this.cs.remove(this.accessTokenStorageKey)
    this.cs.remove(this.idTokenStorageKey)
    this.cs.remove(this.accessTokenExpiryStorageKey)
    this.unscheduleRenewal()
  }

  public handleAuthentication(): void {
    this.az.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult)
        // this.router.navigate(['/home'])
      } else if (err) {
        // this.router.navigate(['/home'])
      }
    })
  }

  public renewToken() {
    this.az.checkSession({}, (err, result) => {
      if (!err) this.setSession(result)
    })
  }

  public unscheduleRenewal() {
    this.refreshSubscription.unsubscribe()
  }

  public scheduleRenewal() {
    if (!this.isTokenValid()) return
    this.unscheduleRenewal()

    const expires = this.cs.get(this.accessTokenExpiryStorageKey)

    const source = Observable.of(expires).flatMap(expiresAt => {
      return Observable.timer(Math.max(1, expiresAt - Date.now()))
    })

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
  ): Observable<auth0.Auth0UserProfile | undefined> {
    return this.validationFactory(
      accessToken,
      this.cs.get(this.idTokenStorageKey)
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
  }
}