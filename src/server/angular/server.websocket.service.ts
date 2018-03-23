import { Inject, Injectable, NgZone } from '@angular/core'
import { Observer } from 'rxjs/Observer'
import { Observable } from 'rxjs/Observable'
import { webSocketServer } from '../server'
import {
  AUTH0_VALIDATION_FACTORY,
  IAuth0ValidationFactory
} from '../../client/app/shared/services/auth.service'
import { CookieService } from '../../client/app/shared/services/cookie.service'
import { AUTH_ID_TOKEN_STORAGE_KEY } from '../../client/app/shared/auth/tokens'
import { parse } from 'cookie'
import * as WebSocket from 'ws'
import { shareReplay, take } from 'rxjs/operators'

@Injectable()
export class ServerWebSocketService {
  private readonly connectionSource = Observable.create(
    (obs: Observer<{ readonly ws: WebSocket; readonly req: any }>) => {
      this.ngZone.runOutsideAngular(() => {
        webSocketServer.on('connection', (ws: WebSocket, req) => {
          obs.next({ ws, req })
          obs.complete()
        })
      })
    }
  ).pipe(shareReplay(1)) as Observable<{
    readonly ws: WebSocket
    readonly req: any
  }>

  constructor(
    private ngZone: NgZone,
    @Inject(AUTH0_VALIDATION_FACTORY) authValidator: IAuth0ValidationFactory,
    @Inject(AUTH_ID_TOKEN_STORAGE_KEY) tokenKey: any,
    cs: CookieService
  ) {
    this.connectionSource.subscribe(connection => {
      connection.ws.on('message', data => {
        const clientAuthorizationToken = parse(connection.req.headers
          .cookie as any)[tokenKey]
        authValidator(undefined, clientAuthorizationToken)
          .pipe(take(1))
          .subscribe(user => {
            // TOOD: send this even off to be processed
          })
      })
    })
  }
}
