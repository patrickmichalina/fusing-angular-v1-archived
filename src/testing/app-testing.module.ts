import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { REQUEST } from '@nguniversal/express-engine/tokens'
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core'
import { HttpClientModule } from '@angular/common/http'
import { PlatformService } from '../client/app/shared/services/platform.service'
import { CookieService } from '../client/app/shared/services/cookie.service'
import { EnvironmentService } from '../client/app/shared/services/environment.service'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { APP_BASE_HREF } from '@angular/common'
import { MockCookieService } from './mock-cookie.service'
import { MockEnvironmentService } from './mock-environment.service'
import { SharedModule } from '../client/app/shared/shared.module'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { Angulartics2Module } from 'angulartics2'
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga'
import './client/operators'

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
    { provide: CookieService, useClass: MockCookieService },
    { provide: EnvironmentService, useClass: MockEnvironmentService }
  ]
})
export class AppTestingModule {
  static forRoot(requestProvider?: any, windowTokenProvider?: any, authConfigProvider?: any): ModuleWithProviders {
    return {
      ngModule: AppTestingModule,
      providers: [
        requestProvider || { provide: REQUEST, useValue: {} },
        { provide: APP_BASE_HREF, useValue: '/' }
      ]
    } as ModuleWithProviders
  }
  constructor(@Optional() @SkipSelf() parentModule: AppTestingModule) {
    if (parentModule)
      throw new Error('AppTestingModule already loaded.')
  }
}
