import { SEOService } from './shared/services/seo.service'
import {
  ApplicationRef,
  ChangeDetectionStrategy,
  Component
} from '@angular/core'
import { EnvironmentService } from './shared/services/environment.service'
import { InjectionService } from './shared/services/injection.service'
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga'
import { PlatformService } from './shared/services/platform.service'
import { AuthService } from './shared/services/auth.service'
import { filter, map, mergeMap, shareReplay } from 'rxjs/operators'

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
  private readonly routeData$ = this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    map(() => this.ar),
    map(route => {
      // tslint:disable-next-line:no-parameter-reassignment
      while (route.firstChild) route = route.firstChild
      return route
    }),
    mergeMap(route => route.data),
    shareReplay(1)
  )

  private readonly routeMeta$ = this.routeData$.pipe(
    map(a => a.meta as RouteMeta | undefined)
  )

  constructor(
    analytics: Angulartics2GoogleAnalytics,
    es: EnvironmentService,
    is: InjectionService,
    private router: Router,
    private ar: ActivatedRoute,
    seo: SEOService,
    // private wss: WebSocketService,
    ps: PlatformService,
    appRef: ApplicationRef,
    auth: AuthService
  ) {
    this.routeMeta$.pipe(filter(Boolean)).subscribe((meta: RouteMeta) => {
      seo.setTitle(meta.title)
      seo.setDescription(meta.description)
    })
  }
}
