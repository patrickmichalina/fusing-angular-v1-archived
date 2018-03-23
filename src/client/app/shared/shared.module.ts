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
import { WindowService } from './services/utlities/window.service'
import { MinifierService } from './services/utlities/minifier.service'
import { ExternalLinkDirective } from './directives/external-link.directive'
import { SvgDirective } from './svg/svg.directive'
import { NoteService } from './services/data/note.service'
import { UrlService } from './services/url.service'
import { COOKIE_HOST_WHITELIST } from './services/http-interceptors/http-authorization-interceptor.service'
import { RouteDataService } from './services/route-data.service'

export function cookieWhitelistFactory(es: EnvironmentService) {
  return [es.config.siteUrl]
}

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
      useFactory: cookieWhitelistFactory,
      deps: [EnvironmentService]
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
    WindowService,
    NoteService,
    UrlService,
    RouteDataService
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule
    }
  }
}
