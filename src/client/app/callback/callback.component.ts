import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'pm-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CallbackComponent {
  constructor() {
    // if (ps.isBrowser) {
    //   auth.login().subscribe()
    // }
  }
}
