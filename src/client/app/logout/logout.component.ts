import { ChangeDetectionStrategy, Component } from '@angular/core'
import { AuthService } from '../shared/services/auth.service'
import { Router } from '@angular/router'

@Component({
  selector: 'pm-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogoutComponent {
  constructor(auth: AuthService, router: Router) {
    auth.logout()
    router.navigate(['/'], { skipLocationChange: true })
  }
}
