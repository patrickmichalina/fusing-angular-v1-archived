import { SEOService } from './shared/services/seo.service'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga'
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
    seo: SEOService,
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
