import { SEOService } from './shared/services/seo.service'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga'
import { RouteDataService } from './shared/services/route-data.service'

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
    rds: RouteDataService
  ) {
    rds.meta().subscribe(meta => {
      seo.setTitle(meta.title)
      seo.setDescription(meta.description)
    })
  }
}
