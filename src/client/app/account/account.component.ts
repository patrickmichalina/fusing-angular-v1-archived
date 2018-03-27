import { ChangeDetectionStrategy, Component } from '@angular/core'
import { AuthService } from '../shared/services/auth.service'

@Component({
  selector: 'pm-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountComponent {
  constructor(private auth: AuthService) {}
  readonly user$ = this.auth.user$
}
