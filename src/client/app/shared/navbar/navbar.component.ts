import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output
} from '@angular/core'
import { AuthService } from '../services/auth.service'
import { map } from 'rxjs/operators'

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
  @Output() readonly menuIconClick = new EventEmitter()

  readonly userView$ = this.auth.user$.pipe(
    map(user => {
      const greeting = user && `Welcome, ${user.nickname}`
      return {
        ...user,
        greeting,
        roles:
          user &&
          Object.keys(user.roles || {}).filter(key => (user.roles || {})[key]),
        show: greeting ? 1 : 0
      }
    })
  )

  constructor(private auth: AuthService) {}

  login() {
    this.auth.login()
  }

  logout() {
    this.auth.logout()
  }

  trackByRole(index: number, role: string) {
    return role
  }
}
