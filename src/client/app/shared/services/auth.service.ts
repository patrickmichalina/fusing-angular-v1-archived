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
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { EnvironmentService } from './environment.service'
import * as auth0 from 'auth0-js'

export const AUTH0_CLIENT = new InjectionToken('cfg.auth0.client')

export function authZeroFactory(es: EnvironmentService) {
  return new auth0.WebAuth(es.config.auth0 as any)
}

@Injectable()
export class AuthService {
  constructor(
    private cs: CookieService,
    private http: HttpClient,
    @Inject(AUTH0_CLIENT) private az: auth0.WebAuth,
    @Inject(AUTH_ID_TOKEN_STORAGE_KEY) private idTokenStorageKey: string,
    @Inject(AUTH_ACCESS_TOKEN_STORAGE_KEY)
    private accessTokenStorageKey: string,
    @Inject(AUTH_ACCESS_TOKEN_EXPIRY_STORAGE_KEY)
    private accessTokenExpiryStorageKey: string
  ) {
    cs.valueChanges
      .map(a => a[this.accessTokenStorageKey])
      .subscribe(user => this.accessTokenSource.next(user))
  }

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
  }

  public handleAuthentication(): void {
    this.az.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult)
        // this.router.navigate(['/home'])
      } else if (err) {
        // this.router.navigate(['/home'])
        // alert(`Error: ${err.error}. Check the console for further details.`)
      }
    })
  }

  private getUserProfile(
    accessToken?: string
  ): Observable<auth0.Auth0UserProfile | undefined> {
    return !accessToken
      ? Observable.of(undefined)
      : this.http.get<auth0.Auth0UserProfile>(
          `${(this.az.client as any).baseOptions.rootUrl}/userinfo`,
          {
            headers: new HttpHeaders({ Authorization: `Bearer ${accessToken}` })
          }
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
}
