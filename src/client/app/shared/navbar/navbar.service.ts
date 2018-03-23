import { Observable } from 'rxjs/Observable'
import { Injectable } from '@angular/core'
import { of } from 'rxjs/observable/of'

export interface INavbarService {
  readonly menu$: Observable<ReadonlyArray<any>>
}

@Injectable()
export class NavbarService implements INavbarService {
  readonly menu$ = of([
    { route: 'dashboard', name: 'Dashboard' },
    { route: 'about', name: 'About' }
  ])
}
