import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga'
import { EnvironmentService } from './shared/services/environment.service'
import { InjectionService } from './shared/services/injection.service'
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { SEOService } from './shared/services/seo.service'

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
  private readonly routeData$ = this.router.events
    .filter(event => event instanceof NavigationEnd)
    .map(() => this.ar)
    .map(route => {
      // tslint:disable-next-line:no-parameter-reassignment
      while (route.firstChild) route = route.firstChild
      return route
    })
    .filter(route => route.outlet === 'primary')
    .mergeMap(route => route.data)
    .shareReplay(1)

  private readonly routeMeta$ = this.routeData$.map(a => a.meta as RouteMeta)

  constructor(
    analytics: Angulartics2GoogleAnalytics,
    es: EnvironmentService,
    is: InjectionService,
    private router: Router,
    private ar: ActivatedRoute,
    seo: SEOService
  ) {
    this.routeMeta$.subscribe(meta => {
      seo.setTitle(meta.title)
      seo.setDescription(meta.description)
    })
  }
}
