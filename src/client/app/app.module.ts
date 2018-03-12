import { NgModule } from '@angular/core'
import { HttpCookieInterceptor } from './shared/services/http-cookie-interceptor.service'
import { AppComponent } from './app.component'
import { SharedModule } from './shared/shared.module'
import { AppRoutingModule } from './app-routing.module'
import { NotFoundModule } from './not-found/not-found.module'
import { BrowserModule } from '@angular/platform-browser'
import { ServerResponseService } from './shared/services/server-response.service'
import { Angulartics2Module } from 'angulartics2'
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga'
import { HTTP_INTERCEPTORS, HttpClientModule, HttpResponse } from '@angular/common/http'
import { CACHE_TAG_CONFIG, CACHE_TAG_FACTORY, CacheTagConfig, HttpCacheTagModule } from './shared/http-cache-tag/http-cache-tag.module'
import { TransferHttpCacheModule } from '@nguniversal/common'

export function cacheTagFactory(srs: ServerResponseService): any {
  return (httpResponse: HttpResponse<any>, config: CacheTagConfig) => {
    const cacheHeader = httpResponse.headers.get(config.headerKey)
    cacheHeader && srs.appendHeader(config.headerKey, cacheHeader)
  }
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
        deps: [ServerResponseService]
      })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpCookieInterceptor, multi: true }
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  exports: [AppComponent]
})
export class AppModule { }
