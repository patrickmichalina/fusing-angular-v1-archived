import { Injectable } from '@angular/core'

// export interface IAuthService<TUser> {
//   readonly user$: Observable<ExtendedUser<TUser>>
//   readonly isLoggedIn$: Observable<boolean>
//   readonly isLoggedOut$: Observable<boolean>
//   login(): Observable<ExtendedUser<TUser>>
//   logout(): void
// }

@Injectable()
export class AuthService {
  // private readonly userIdentitySource = new BehaviorSubject<
  //   ExtendedUser<TUser>
  //   >(this.hydrateUser())
  // public readonly user$: Observable<
  //   ExtendedUser<TUser>
  //   > = this.userIdentitySource
  //     .distinctUntilChanged((x, y) => (x && sha1(x)) === (y && sha1(y)))
  //     .shareReplay(1)
  // public readonly isLoggedIn$ = this.user$.map(user => (user ? true : false))
  // public readonly isLoggedOut$ = this.isLoggedIn$.map(a => !a)
  // private watchValueChanges() {
  //   this.storage.valueChanges.subscribe(() =>
  //     this.userIdentitySource.next(this.hydrateUser())
  //   )
  // }
  // private getTokenFromStore() {
  //   return this.storage.get(this.idTokenStorageKey)
  // }
  // private decodedToken() {
  //   return this.authTokenDecoder(this.getTokenFromStore())
  // }
  // private validatedToken() {
  //   return this.tokenValidator(
  //     this.getTokenFromStore(),
  //     this.decodedToken()
  //   )
  // }
  // private hydrateUser() {
  //   const decoded = this.validatedToken()
  //   return decoded ? this.userHydrator(decoded) : undefined
  // }
  // initCallback() {
  //   this.callbackFactory()
  // }
  // login(): Observable<ExtendedUser<TUser>> {
  //   return this.tokenFetchFactory().flatMap(token => {
  //     this.setSessionFactory(
  //       this.storage, token.idToken, token.accessToken, undefined,
  //       this.idTokenStorageKey, this.accessTokenStorageKey, this.accessTokenExpiryStorageKey,
  //       this.refreshTokenStorageKey
  //     )
  //     return this.user$.withLatestFrom()
  //   })
  // }
  // logout(): void {
  //   this.removeSessionFactory(
  //     this.storage,
  //     this.idTokenStorageKey,
  //     this.refreshTokenStorageKey
  //   )
  // }
}
