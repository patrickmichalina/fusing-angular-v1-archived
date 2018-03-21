import {
  CACHE_TAG_CONFIG,
  CACHE_TAG_FACTORY,
  CacheTagConfig,
  HttpCacheTagModule
} from './shared/http-cache-tag/http-cache-tag.module'
import { TransferHttpCacheModule } from '@nguniversal/common'
import { AppComponent } from './app.component'
import { SharedModule } from './shared/shared.module'
import { AppRoutingModule } from './app-routing.module'
import { NotFoundModule } from './not-found/not-found.module'
import { BrowserModule, TransferState } from '@angular/platform-browser'
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga'
import { Angulartics2Module } from 'angulartics2'
import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
  HttpResponse
} from '@angular/common/http'
import { HttpCookieInterceptor } from './shared/services/http-interceptors/http-cookie-interceptor.service'
import { ErrorHandler, InjectionToken, NgModule } from '@angular/core'
import {
  GlobalErrorHandler,
  ROLLBAR_CONFIG,
  ROLLBAR_TS_KEY
} from './shared/services/error-handlers/global-error-handler.service'
import { ResponseService } from './shared/services/response.service'
import { IScheduler } from 'rxjs/Scheduler'
import {
  AUTH_ACCESS_TOKEN_EXPIRY_STORAGE_KEY,
  AUTH_ACCESS_TOKEN_STORAGE_KEY,
  AUTH_ID_TOKEN_STORAGE_KEY
} from './shared/auth/tokens'
import { EnvironmentService } from './shared/services/environment.service'
import {
  AUTH0_CLIENT,
  AUTH_ROLES_KEY,
  AuthService,
  authZeroFactory,
  rolesKeyFactory
} from './shared/services/auth.service'
import * as Rollbar from 'rollbar'
import {
  AUTH_BEARER_HOSTS,
  HttpAuthInterceptor
} from './shared/services/http-interceptors/http-authorization-interceptor.service'

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

export const appAuthIdTokenKey = 'id-token'
export const appAuthAccessTokenKey = 'access-token'
export const appAuthAccessExpiryTokenKey = 'access-token-expiry'

@NgModule({
  imports: [
    HttpClientModule,
    AppRoutingModule,
    NotFoundModule,
    TransferHttpCacheModule,
    SharedModule.forRoot(),
    Angulartics2Module.forRoot([Angulartics2GoogleAnalytics], {
      pageTracking: {
        clearHash: true
      }
    }),
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
    AuthService,
    { provide: AUTH_BEARER_HOSTS, useValue: [] },
    {
      provide: AUTH_ROLES_KEY,
      useFactory: rolesKeyFactory,
      deps: [EnvironmentService]
    },
    {
      provide: AUTH0_CLIENT,
      useFactory: authZeroFactory,
      deps: [EnvironmentService]
    },
    { provide: AUTH_ID_TOKEN_STORAGE_KEY, useValue: appAuthIdTokenKey },
    { provide: AUTH_ACCESS_TOKEN_STORAGE_KEY, useValue: appAuthAccessTokenKey },
    {
      provide: AUTH_ACCESS_TOKEN_EXPIRY_STORAGE_KEY,
      useValue: appAuthAccessExpiryTokenKey
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpCookieInterceptor,
      multi: true
    },
    { provide: HTTP_INTERCEPTORS, useClass: HttpAuthInterceptor, multi: true },
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
export class AppModule {}
