import { Http } from '@angular/http'
import { Injectable } from '@angular/core'
import { PlatformService } from '../platform.service'
import { Observable } from 'rxjs/Observable'
import { catchError, switchMap } from 'rxjs/operators'
import { of } from 'rxjs'

export interface IAdBlockService {
  readonly adBlockerIsActive$: Observable<boolean>
}

@Injectable()
export class AdBlockService implements IAdBlockService {
  public readonly adBlockerIsActive$ = this.platformService.isBrowser
    ? this.http
        .get('./ad-server.js')
        .pipe(switchMap(a => of(false)), catchError(a => of(true)))
    : of(false)

  constructor(private platformService: PlatformService, private http: Http) {}
}
