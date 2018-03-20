import { HttpCookieInterceptor } from './shared/services/http-interceptors/http-cookie-interceptor.service'
import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
  HttpResponse
} from '@angular/common/http'
import { AppComponent } from './app.component'
import { SharedModule } from './shared/shared.module'
import { AppRoutingModule } from './app-routing.module'
import { NotFoundModule } from './not-found/not-found.module'
import { BrowserModule, TransferState } from '@angular/platform-browser'
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga'
import { Angulartics2Module } from 'angulartics2'
import { TransferHttpCacheModule } from '@nguniversal/common'
import {
  CACHE_TAG_CONFIG,
  CACHE_TAG_FACTORY,
  CacheTagConfig,
  HttpCacheTagModule
} from './shared/http-cache-tag/http-cache-tag.module'
import {
  ErrorHandler,
  InjectionToken,
  Injector,
  NgModule,
  NgModuleRef
} from '@angular/core'
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
  AuthService,
  authZeroFactory
} from './shared/services/auth.service'
import * as Rollbar from 'rollbar'

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
    {
      provide: AUTH0_CLIENT,
      useFactory: authZeroFactory,
      deps: [EnvironmentService]
    },
    { provide: AUTH_ID_TOKEN_STORAGE_KEY, useValue: 'id-token' },
    { provide: AUTH_ACCESS_TOKEN_STORAGE_KEY, useValue: 'access-token' },
    {
      provide: AUTH_ACCESS_TOKEN_EXPIRY_STORAGE_KEY,
      useValue: 'access-token-expiry'
    },
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
