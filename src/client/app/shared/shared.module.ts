import { LoggingService } from './services/logging.service'
import { RouterModule } from '@angular/router'
import { NavbarComponent } from './navbar/navbar.component'
import { CookieService } from './services/cookie.service'
import { CommonModule } from '@angular/common'
import { PlatformService } from './services/platform.service'
import { ModuleWithProviders, NgModule } from '@angular/core'
import { WebSocketService } from './services/web-socket.service'
import { EnvironmentService } from './services/environment.service'
import { NavbarService } from './navbar/navbar.service'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { InjectionService } from './services/injection.service'
import { SEOService } from './services/seo.service'
import { KeysPipe } from './pipes/keys.pipe'
import { KeyValuePipe } from './pipes/key-value.pipe'
import { SanitizeHtmlPipe } from './pipes/sanitize-html.pipe'
import { COOKIE_HOST_WHITELIST } from './services/http-interceptors/http-cookie-interceptor.service'
import { WindowService } from './services/utlities/window.service'
import { MinifierService } from './services/utlities/minifier.service'
import { ExternalLinkDirective } from './directives/external-link.directive'
import { SvgDirective } from './svg/svg.directive'

@NgModule({
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  exports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    FormsModule,
    ReactiveFormsModule,
    KeysPipe,
    KeyValuePipe,
    SanitizeHtmlPipe,
    ExternalLinkDirective,
    SvgDirective
  ],
  declarations: [
    NavbarComponent,
    KeysPipe,
    KeyValuePipe,
    SanitizeHtmlPipe,
    ExternalLinkDirective,
    SvgDirective
  ],
  providers: [
    {
      provide: COOKIE_HOST_WHITELIST,
      useValue: ['angular.patrickmichalina.com']
    },
    PlatformService,
    CookieService,
    EnvironmentService,
    NavbarService,
    LoggingService,
    WebSocketService,
    InjectionService,
    MinifierService,
    SEOService,
    WindowService
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule
    }
  }
}
