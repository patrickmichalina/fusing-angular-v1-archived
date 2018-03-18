import { ChangeDetectionStrategy, Component } from '@angular/core'
import { AuthService } from '../services/auth.service'

export interface User {
  readonly photoURL: string
  readonly email: string
  readonly name: string
}

@Component({
  selector: 'pm-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  readonly userView$ = this.auth.user$.map(a => {
    const greeting = a && `Welcome, ${a.nickname}`
    return {
      greeting,
      show: greeting ? 0 : 1
    }
  })

  constructor(private auth: AuthService) {}

  login() {
    this.auth.login()
  }
}
