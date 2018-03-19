import { ResponseService } from './shared/services/response.service'
import { REQUEST } from '@nguniversal/express-engine/src/tokens'
import { AppModule } from './app.module'
import { NgModule } from '@angular/core'
import { AppComponent } from './app.component'
import { ENV_CONFIG, ENV_CONFIG_TS_KEY, REQUEST_TS_KEY } from './app.config'
import { WINDOW } from './shared/services/utlities/window.service'
import {
  BrowserModule,
  BrowserTransferStateModule,
  TransferState
} from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { LOGGER_CONFIG } from './shared/services/logging.service'
import { SVGLoaderService } from './shared/svg/svg-loader.service'
import { HttpClient } from '@angular/common/http'
import {
  AUTH0_CLIENT,
  AUTH0_USER_TRANSFER,
  AUTH0_VALIDATION_FACTORY
} from './shared/services/auth.service'
import * as auth0 from 'auth0-js'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'

// import { ServiceWorkerModule, SwUpdate } from '@angular/service-worker'
// import { Observable } from 'rxjs/Observable'
// import 'hammerjs'

export function fuseBoxConfigFactory(ts: TransferState) {
  return ts.get(ENV_CONFIG_TS_KEY, {})
}

export function requestFactory(transferState: TransferState): any {
  return transferState.get<any>(REQUEST_TS_KEY, {})
}

export function auth0BrowserValidationFactory(
  az: auth0.WebAuth,
  ts: TransferState
): any {
  return (accessToken?: string, idToken?: string) => {
    return !accessToken
      ? Observable.of(undefined)
      : Observable.create((obs: Observer<any>) => {
          const fromServerRender = ts.get(AUTH0_USER_TRANSFER, undefined)
          if (fromServerRender) {
            obs.next(fromServerRender)
            obs.complete()
          } else {
            az.client.userInfo(accessToken, (err, profile) => {
              if (err) {
                obs.error(err)
                obs.complete()
              } else {
                obs.next(profile)
                obs.complete()
              }
            })
          }
        }).do(() => ts.remove(AUTH0_USER_TRANSFER))
  }
}

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'pm-app' }),
    BrowserTransferStateModule,
    BrowserAnimationsModule,
    AppModule
  ],
  providers: [
    {
      provide: SVGLoaderService,
      useClass: SVGLoaderService,
      deps: [HttpClient, TransferState]
    },
    { provide: WINDOW, useValue: window },
    {
      provide: AUTH0_VALIDATION_FACTORY,
      useFactory: auth0BrowserValidationFactory,
      deps: [AUTH0_CLIENT, TransferState]
    },
    {
      provide: ENV_CONFIG,
      useFactory: fuseBoxConfigFactory,
      deps: [TransferState]
    },
    {
      provide: REQUEST,
      useFactory: requestFactory,
      deps: [TransferState]
    },
    {
      provide: LOGGER_CONFIG,
      useValue: {
        name: 'Universal WebApp',
        type: 'client-side'
      }
    },
    ResponseService
  ]
})
export class AppBrowserModule {
  // tslint:disable:no-console
  // constructor(updates: SwUpdate) {
  //   Observable.interval(100000).subscribe(() => updates.checkForUpdate())
  //   updates.available.subscribe(event => {
  //     console.log('current version is', event.current)
  //     console.log('available version is', event.available)
  //   })
  //   updates.activated.subscribe(event => {
  //     console.log('old version was', event.previous)
  //     console.log('new version is', event.current)
  //   })
  // }
}
