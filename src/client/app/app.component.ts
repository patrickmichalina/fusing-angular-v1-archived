import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga'
import { EnvironmentService } from './shared/services/environment.service'
import { WindowService } from './shared/services/utlities/window.service'

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
    ws: WindowService
  ) {
    // tslint:disable-next-line:no-console
    console.log('logging environment: ', es.config)
  }
}
