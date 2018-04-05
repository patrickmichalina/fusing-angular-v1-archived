import { Observer } from 'rxjs/Observer'
import { SVGLoaderService } from './shared/svg/svg-loader.service'
import { ApplicationRef, NgModule } from '@angular/core'
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
import { HttpClient } from '@angular/common/http'
import {
  AUTH0_CLIENT,
  AUTH0_USER_TRANSFER,
  AUTH0_VALIDATION_FACTORY,
  AuthService
} from './shared/services/auth.service'
import { Observable } from 'rxjs/Observable'
import { AppModule } from './app.module'
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga'
import { InjectionService } from './shared/services/injection.service'
import { tap } from 'rxjs/operators'
import { of } from 'rxjs/observable/of'
import { REQUEST } from '@nguniversal/express-engine/tokens'
import { ResponseService } from './shared/services/response.service'
import { ServiceWorkerModule } from '@angular/service-worker'
import { EnvironmentService } from './shared/services/environment.service'
import {
  NGSW_INTERVAL,
  NgSwUpdateService
} from './shared/services/ngsw-update.service'
import * as auth0 from 'auth0-js'
// import 'hammerjs'

export function fuseBoxConfigFactory(ts: TransferState) {
  return ts.get(ENV_CONFIG_TS_KEY, {})
}

export function requestFactory(transferState: TransferState): any {
  return transferState.get<any>(REQUEST_TS_KEY, {})
}

export function ngswIntervalFactory(es: EnvironmentService): any {
  return es.config.pwaUpdateInterval || 1000 * 60 * 60 * 12 // 12 hours
}

export function auth0BrowserValidationFactory(
  az: auth0.WebAuth,
  ts: TransferState
): any {
  return (accessToken?: string, idToken?: string) => {
    return !accessToken
      ? of(undefined)
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
        }).pipe(tap(() => ts.remove(AUTH0_USER_TRANSFER)))
  }
}

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'pm-app' }),
    ServiceWorkerModule.register('./ngsw-worker.js', {
      enabled: false
    }),
    BrowserTransferStateModule,
    BrowserAnimationsModule,
    AppModule
  ],
  providers: [
    ResponseService,
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
      provide: NGSW_INTERVAL,
      useFactory: ngswIntervalFactory,
      deps: [EnvironmentService]
    },
    {
      provide: LOGGER_CONFIG,
      useValue: {
        name: 'Universal WebApp',
        type: 'client-side'
      }
    },
    // WebSocketService,
    NgSwUpdateService
  ]
})
export class AppBrowserModule {
  constructor(
    analytics: Angulartics2GoogleAnalytics,
    es: EnvironmentService,
    is: InjectionService,
    auth: AuthService,
    appRef: ApplicationRef,
    ngsw: NgSwUpdateService
  ) {
    // tslint:disable-next-line:no-console
    console.log('logging environment: ', es.config)
    auth.handleAuthentication()
    // appRef.isStable.pipe(filter(a => a), first()).subscribe(() => {
    //   // auth.user$
    //   //   .pipe(filter(Boolean))
    //   //   .subscribe((user: auth0.Auth0UserProfile) =>
    //   //     analytics.setUsername(user.sub)
    //   //   )
    //   // auth.scheduleRenewal()
    //   // ngsw.init()
    // })
  }
}
