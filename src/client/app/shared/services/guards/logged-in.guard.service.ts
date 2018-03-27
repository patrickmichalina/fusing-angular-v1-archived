import { AuthService } from '../auth.service'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import { map } from 'rxjs/operators'
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot
} from '@angular/router'

@Injectable()
export class LoggedInGuard implements CanActivate {
  constructor(private auth: AuthService) {}

  canActivate(
    ars: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.auth.user$.pipe(map(a => (a ? true : false)))
  }
}
