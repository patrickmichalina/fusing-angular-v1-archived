import { TransferHttpCacheModule } from '@nguniversal/common'
import {
  ErrorHandler,
  InjectionToken,
  Injector,
  NgModule,
  NgModuleRef
} from '@angular/core'
import { AppComponent } from './app.component'
import { SharedModule } from './shared/shared.module'
import { AppRoutingModule } from './app-routing.module'
import { NotFoundModule } from './not-found/not-found.module'
import { BrowserModule, TransferState } from '@angular/platform-browser'
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga'
import { Angulartics2Module } from 'angulartics2'
import { HttpCookieInterceptor } from './shared/services/http-interceptors/http-cookie-interceptor.service'
import {
  CACHE_TAG_CONFIG,
  CACHE_TAG_FACTORY,
  CacheTagConfig,
  HttpCacheTagModule
} from './shared/http-cache-tag/http-cache-tag.module'
import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
  HttpResponse
} from '@angular/common/http'
import {
  GlobalErrorHandler,
  ROLLBAR_CONFIG,
  ROLLBAR_TS_KEY
} from './shared/services/error-handlers/global-error-handler.service'
import { ResponseService } from './shared/services/response.service'
import * as Rollbar from 'rollbar'
import { IScheduler } from 'rxjs/Scheduler'
import { AuthModule } from './shared/auth/auth.module'
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
  IFetchTokenFactory,
  IRemoveSessionFactory,
  ISetSessionFactory,
  IStorageProvider,
  ITokenDecoderFactory,
  ITokenValidatorFactory,
  StorageRetrievalTypes
} from './shared/auth/tokens'
import { CookieService } from './shared/services/cookie.service'
import { JwtHelper } from 'angular2-jwt'
import { AppAuthService } from './app.auth.service'
import { Observable } from 'rxjs/Observable'

export const RXJS_DEFAULT_SCHEDULER = new InjectionToken<IScheduler>(
  'cfg.rxjs.sch'
)

export function cacheTagFactory(rs: ResponseService): any {
  return (httpResponse: HttpResponse<any>, config: CacheTagConfig) => {
    const cacheHeader = httpResponse.headers.get(config.headerKey)
    cacheHeader && rs.appendHeader(config.headerKey, cacheHeader)
  }
}

export function rollbarFactory(ts: TransferState) {
  const accessToken = ts.get(ROLLBAR_TS_KEY, undefined)
  return (
    accessToken &&
    new Rollbar({
      accessToken,
      captureUncaught: true,
      captureUnhandledRejections: true
    })
  )
}

export function staticAppInjectorRef(): NgModuleRef<AppModule> {
  return AppModule.injector as any
}

// MOVE TO SPECIAL FILE
// ------- ------- -------
// ------- ------- -------
// ------- ------- -------
export function authTokenDecoderFactory(): ITokenDecoderFactory {
  return (token?: StorageRetrievalTypes) => {
    if (typeof token !== 'string') return undefined
    try {
      return new JwtHelper().decodeToken(token)
    } catch (err) {
      return undefined
    }
  }
}

export function authTokenValidatorFactory(): ITokenValidatorFactory {
  return (token?: StorageRetrievalTypes, decodedToken?: Object) => {
    if (typeof token !== 'string') return undefined
    try {
      const helper = new JwtHelper()
      return !helper.isTokenExpired(token) && decodedToken
    } catch (err) {
      return undefined
    }
  }
}

export function authUserHydrationFactory() {
  return (decodedToken: Object) => {
    return { ...decodedToken }
  }
}

export function authSetSessionFactory(): ISetSessionFactory {
  return (
    storage: IStorageProvider,
    token: string,
    authTokenStorageKey: string,
    refreshTokenStorageKey?: string
  ) => {
    storage.set(authTokenStorageKey, token)
  }
}

export function authRemoveSessionFactory(): IRemoveSessionFactory {
  return (
    storage: IStorageProvider,
    authTokenStorageKey: string,
    refreshTokenStorageKey?: string
  ) => {
    storage.remove(authTokenStorageKey)
  }
}

export function authFetchTokenFactory(): IFetchTokenFactory<any> {
  return () => {
    return Observable.of('1')
  }
}

@NgModule({
  imports: [
    HttpClientModule,
    AppRoutingModule,
    NotFoundModule,
    TransferHttpCacheModule,
    AuthModule.forRoot(
      { provide: AUTH_STORAGE_PROVIDER, useExisting: CookieService },
      { provide: AUTH_TOKEN_STORAGE_KEY, useValue: 'access-token' },
      { provide: AUTH_REFRESH_TOKEN_STORAGE_KEY, useValue: 'refresh-token' },
      {
        provide: AUTH_TOKEN_DECODER_FACTORY,
        useFactory: authTokenDecoderFactory
      },
      {
        provide: AUTH_USER_HYDRATION_FACTORY,
        useFactory: authUserHydrationFactory
      },
      { provide: AUTH_SET_SESSION_FACTORY, useFactory: authSetSessionFactory },
      {
        provide: AUTH_REMOVE_SESSION_FACTORY,
        useFactory: authRemoveSessionFactory
      },
      {
        provide: AUTH_TOKEN_VALIDATOR_FACTORY,
        useFactory: authTokenValidatorFactory
      },
      { provide: AUTH_TOKEN_FETCH_FACTORY, useFactory: authFetchTokenFactory },
      AppAuthService
    ),
    SharedModule.forRoot(),
    Angulartics2Module.forRoot([Angulartics2GoogleAnalytics]),
    BrowserModule.withServerTransition({ appId: 'pm-app' }),
    HttpCacheTagModule.forRoot(
      {
        provide: CACHE_TAG_CONFIG,
        useValue: {
          headerKey: 'Cache-Tag',
          cacheableResponseCodes: [200]
        }
      },
      {
        provide: CACHE_TAG_FACTORY,
        useFactory: cacheTagFactory,
        deps: [ResponseService]
      }
    )
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpCookieInterceptor,
      multi: true
    },
    {
      provide: ROLLBAR_CONFIG,
      useFactory: rollbarFactory,
      deps: [TransferState]
    },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: RXJS_DEFAULT_SCHEDULER, useValue: undefined }
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  exports: [AppComponent]
})
export class AppModule {
  // tslint:disable:readonly-keyword
  // tslint:disable:no-object-mutation
  static injector: Injector
  constructor(injector: Injector) {
    AppModule.injector = injector
  }
}
