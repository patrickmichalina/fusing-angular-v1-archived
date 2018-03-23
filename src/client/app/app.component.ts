import { SEOService } from './shared/services/seo.service'
import {
  ApplicationRef,
  ChangeDetectionStrategy,
  Component
} from '@angular/core'
import { EnvironmentService } from './shared/services/environment.service'
import { InjectionService } from './shared/services/injection.service'
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga'
import { PlatformService } from './shared/services/platform.service'
import { AuthService } from './shared/services/auth.service'
import { filter } from 'rxjs/operators'
import { RouteDataService } from './shared/services/route-data.service'

interface RouteMeta {
  readonly title?: string
  readonly description?: string
}

@Component({
  selector: 'pm-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  constructor(
    analytics: Angulartics2GoogleAnalytics,
    es: EnvironmentService,
    is: InjectionService,
    seo: SEOService,
    ps: PlatformService,
    appRef: ApplicationRef,
    auth: AuthService,
    rd: RouteDataService
  ) {
    rd
      .pluck<RouteMeta>('meta')
      .pipe(filter(Boolean))
      .subscribe((meta: RouteMeta) => {
        seo.setTitle(meta.title)
        seo.setDescription(meta.description)
      })
  }
}
