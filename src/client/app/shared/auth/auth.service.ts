import { Inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import {
  AUTH_REFRESH_TOKEN_STORAGE_KEY,
  AUTH_REMOVE_SESSION_FACTORY,
  AUTH_SET_SESSION_FACTORY,
  AUTH_STORAGE_PROVIDER,
  AUTH_TOKEN_DECODER_FACTORY,
  AUTH_TOKEN_FETCH_FACTORY,
  AUTH_TOKEN_STORAGE_KEY,
  AUTH_TOKEN_VALIDATOR_FACTORY,
  AUTH_USER_HYDRATION_FACTORY,
  ExtendedUser,
  IFetchTokenFactory,
  IRemoveSessionFactory,
  ISetSessionFactory,
  IStorageProvider,
  ITokenDecoderFactory,
  ITokenValidatorFactory,
  IUserHydrationFactory,
  IUserIdentity
} from './tokens'

export interface IAuthService<TUser> {
  readonly user$: Observable<ExtendedUser<TUser>>
  readonly isLoggedIn$: Observable<boolean>
  readonly isLoggedOut$: Observable<boolean>
  login(): Observable<ExtendedUser<TUser>>
  logout(): void
}

@Injectable()
export class AuthService<TUser = IUserIdentity> implements IAuthService<TUser> {
  constructor(
    @Inject(AUTH_STORAGE_PROVIDER) private storage: IStorageProvider,
    @Inject(AUTH_TOKEN_DECODER_FACTORY)
    private authTokenDecoder: ITokenDecoderFactory,
    @Inject(AUTH_TOKEN_VALIDATOR_FACTORY)
    private authTokenValidator: ITokenValidatorFactory,
    @Inject(AUTH_USER_HYDRATION_FACTORY)
    private userHydrator: IUserHydrationFactory<TUser>,
    @Inject(AUTH_SET_SESSION_FACTORY)
    private setSessionFactory: ISetSessionFactory,
    @Inject(AUTH_TOKEN_FETCH_FACTORY)
    private authTokenFetchFactory: IFetchTokenFactory<any>,
    @Inject(AUTH_REMOVE_SESSION_FACTORY)
    private removeSessionFactory: IRemoveSessionFactory,
    @Inject(AUTH_TOKEN_STORAGE_KEY) private authTokenStorageKey: string,
    @Inject(AUTH_REFRESH_TOKEN_STORAGE_KEY)
    private refreshTokenStorageKey: string
  ) {
    this.watchValueChanges()
  }

  private readonly userIdentitySource = new BehaviorSubject<
    ExtendedUser<TUser>
  >(this.hydrateUser())
  public readonly user$: Observable<
    ExtendedUser<TUser>
  > = this.userIdentitySource.shareReplay(1)
  public readonly isLoggedIn$ = this.user$.map(user => (user ? true : false))
  public readonly isLoggedOut$ = this.isLoggedIn$.map(a => !a)

  private watchValueChanges() {
    this.storage.valueChanges.subscribe(() =>
      this.userIdentitySource.next(this.hydrateUser())
    )
  }

  private getTokenFromStore() {
    return this.storage.get(this.authTokenStorageKey)
  }

  private decodedToken() {
    return this.authTokenDecoder(this.getTokenFromStore())
  }

  private validatedToken() {
    return this.authTokenValidator(
      this.getTokenFromStore(),
      this.decodedToken()
    )
  }

  private hydrateUser() {
    const decoded = this.validatedToken()
    return decoded ? this.userHydrator(decoded) : undefined
  }

  private loginUsingRawJWT(token: string): Observable<ExtendedUser<TUser>> {
    this.setSessionFactory(
      this.storage,
      token,
      this.authTokenStorageKey,
      this.refreshTokenStorageKey
    )
    return this.user$.withLatestFrom()
  }

  login(): Observable<ExtendedUser<TUser>> {
    return this.authTokenFetchFactory().flatMap(token =>
      this.loginUsingRawJWT(token)
    )
  }

  logout(): void {
    this.removeSessionFactory(
      this.storage,
      this.authTokenStorageKey,
      this.refreshTokenStorageKey
    )
  }
}
