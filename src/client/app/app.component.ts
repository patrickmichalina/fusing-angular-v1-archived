import { ChangeDetectionStrategy, Component, Renderer2 } from '@angular/core'
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga'
import { EnvironmentService } from './shared/services/environment.service'
import { TransferState } from '@angular/platform-browser'
import { InjectionService } from './shared/services/injection.service'

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
    ts: TransferState,
    rd: Renderer2,
    is: InjectionService
  ) {
    // tslint:disable-next-line:no-console
    console.log('logging environment: ', JSON.parse(ts.toJson()))
    this.setBase(rd, is, es.config.siteUrl)
  }

  setBase(rd: Renderer2, is: InjectionService, href = '/') {
    is
      .inject(rd, {
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
