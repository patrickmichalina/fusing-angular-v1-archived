import { MockEnvironmentService } from './mock-environment.service'
import { APP_BASE_HREF } from '@angular/common'
import { REQUEST } from '@nguniversal/express-engine/tokens'
import {
  Injector,
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf
} from '@angular/core'
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { PlatformService } from '../client/app/shared/services/platform.service'
import { CookieService } from '../client/app/shared/services/cookie.service'
import { EnvironmentService } from '../client/app/shared/services/environment.service'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { MockCookieService } from './mock-cookie.service'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { SharedModule } from '../client/app/shared/shared.module'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { Angulartics2Module } from 'angulartics2'
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga'
import { SVGLoaderService } from '../client/app/shared/svg/svg-loader.service'
import { TransferState } from '@angular/platform-browser'
import {
  AUTH0_CLIENT,
  AuthService
} from '../client/app/shared/services/auth.service'
import { Observable } from 'rxjs/Observable'
import {
  LOGGER_CONFIG,
  LoggingService
} from '../client/app/shared/services/logging.service'
import { AUTH_BEARER_HOSTS } from '../client/app/shared/services/http-interceptors/http-authorization-interceptor.service'
import './client/operators'
import { UrlService } from '../client/app/shared/services/url.service'
import { MockUrlService } from './mock-url.service'

@NgModule({
  imports: [
    HttpClientModule,
    HttpClientTestingModule,
    RouterTestingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    BrowserAnimationsModule,
    Angulartics2Module.forRoot([Angulartics2GoogleAnalytics])
  ],
  exports: [
    HttpClientModule,
    HttpClientTestingModule,
    RouterTestingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    BrowserAnimationsModule
  ],
  providers: [
    PlatformService,
    TransferState,
    {
      provide: SVGLoaderService,
      useClass: SVGLoaderService,
      deps: [HttpClient]
    },
    { provide: CookieService, useClass: MockCookieService },
    { provide: EnvironmentService, useClass: MockEnvironmentService },
    { provide: AUTH_BEARER_HOSTS, useValue: [] },
    {
      provide: AuthService,
      useValue: {
        user$: Observable.of({}),
        handleAuthentication: () => undefined,
        scheduleRenewal: () => undefined,
        getValidToken: () => undefined,
        logout: () => undefined
      }
    },
    { provide: AUTH0_CLIENT, useValue: {} },
    {
      provide: LOGGER_CONFIG,
      useValue: {
        name: 'Universal Webapp',
        type: 'testing-app'
      }
    },
    LoggingService,
    { provide: UrlService, useClass: MockUrlService }
  ]
})
export class AppTestingModule {
  // tslint:disable-next-line:readonly-keyword
  static injector: Injector
  static forRoot(
    requestProvider?: any,
    windowTokenProvider?: any,
    authConfigProvider?: any
  ): ModuleWithProviders {
    return {
      ngModule: AppTestingModule,
      providers: [
        requestProvider || { provide: REQUEST, useValue: {} },
        { provide: APP_BASE_HREF, useValue: '/' }
      ]
    } as ModuleWithProviders
  }
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: AppTestingModule,
    injector: Injector
  ) {
    // tslint:disable-next-line:no-object-mutation
    AppTestingModule.injector = injector
    if (parentModule) throw new Error('AppTestingModule already loaded.')
  }
}
