import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga'
import { EnvironmentService } from './shared/services/environment.service'
import { InjectionService } from './shared/services/injection.service'
import { PlatformService } from './shared/services/platform.service'
import { AuthService } from './shared/services/auth.service'

@Component({
  selector: 'pm-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  constructor(
    public analytics: Angulartics2GoogleAnalytics,
    es: EnvironmentService,
    is: InjectionService,
    auth: AuthService,
    ps: PlatformService
  ) {
    // tslint:disable-next-line:no-console
    console.log('logging environment: ', es.config)
    this.setBase(is, es.config.siteUrl)
    auth.user$.subscribe(user => {
      ps.isBrowser && user && analytics.setUsername(user.sub)
    })
    ps.isBrowser && auth.handleAuthentication()
    ps.isBrowser && auth.scheduleRenewal()
  }

  setBase(is: InjectionService, href = '/') {
    is
      .inject({
        inHead: true,
        element: 'base',
        attributes: {
          href
        }
      })
      .take(1)
      .subscribe()
  }
}
