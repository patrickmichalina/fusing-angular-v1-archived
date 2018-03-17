import {
  ModuleWithProviders,
  NgModule,
  Optional,
  Provider,
  SkipSelf
} from '@angular/core'
import { AuthService } from './auth.service'

@NgModule()
export class AuthModule {
  static forRoot(
    AUTH_STORAGE_PROVIDER: Provider,
    AUTH_TOKEN_STORAGE_KEY: Provider,
    AUTH_REFRESH_TOKEN_STORAGE_KEY: Provider,
    AUTH_TOKEN_DECODER_FACTORY: Provider,
    AUTH_USER_HYDRATION_FACTORY: Provider,
    AUTH_SET_SESSION_FACTORY: Provider,
    AUTH_REMOVE_SESSION_FACTORY: Provider,
    AUTH_TOKEN_VALIDATOR_FACTORY: Provider,
    AUTH_TOKEN_FETCH_FACTORY: Provider,
    authService?: Provider
  ): ModuleWithProviders {
    const optional: ReadonlyArray<any> = [
      authService ? authService : AuthService
    ].filter(Boolean)

    return {
      ngModule: AuthModule,
      providers: [
        AUTH_STORAGE_PROVIDER,
        AUTH_TOKEN_STORAGE_KEY,
        AUTH_REFRESH_TOKEN_STORAGE_KEY,
        AUTH_TOKEN_DECODER_FACTORY,
        AUTH_USER_HYDRATION_FACTORY,
        AUTH_SET_SESSION_FACTORY,
        AUTH_REMOVE_SESSION_FACTORY,
        AUTH_TOKEN_VALIDATOR_FACTORY,
        AUTH_TOKEN_FETCH_FACTORY,
        ...optional
      ]
    }
  }

  constructor(
    @Optional()
    @SkipSelf()
    parentModule: AuthModule
  ) {
    if (parentModule)
      throw new Error('AuthModule already loaded. Import in root module only.')
  }
}
