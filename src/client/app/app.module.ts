import { ErrorHandler, Injector, NgModule } from '@angular/core'
import { Angulartics2Module } from 'angulartics2'
import { AppComponent } from './app.component'
import { SharedModule } from './shared/shared.module'
import { AppRoutingModule } from './app-routing.module'
import { NotFoundModule } from './not-found/not-found.module'
import { BrowserModule, TransferState } from '@angular/platform-browser'
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga'
import { HttpCookieInterceptor } from './shared/services/http-interceptors/http-cookie-interceptor.service'
import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
  HttpResponse
} from '@angular/common/http'
import {
  CACHE_TAG_CONFIG,
  CACHE_TAG_FACTORY,
  CacheTagConfig,
  HttpCacheTagModule
} from './shared/http-cache-tag/http-cache-tag.module'
import { TransferHttpCacheModule } from '@nguniversal/common'
import {
  GlobalErrorHandler,
  ROLLBAR_CONFIG,
  ROLLBAR_TS_KEY
} from './shared/services/error-handlers/global-error-handler.service'
import { ResponseService } from './shared/services/response.service'
import * as Rollbar from 'rollbar'

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

@NgModule({
  imports: [
    HttpClientModule,
    AppRoutingModule,
    NotFoundModule,
    TransferHttpCacheModule,
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
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
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
