import { SVGLoaderService } from '../../client/app/shared/svg/svg-loader.service'
import {
  DOMInjectable,
  InjectionService
} from '../../client/app/shared/services/injection.service'
import { AppComponent } from './../../client/app/app.component'
import { EnvConfig } from '../../../tools/config/app.config'
import {
  APP_BOOTSTRAP_LISTENER,
  APP_INITIALIZER,
  ApplicationRef,
  enableProdMode,
  NgModule
} from '@angular/core'
import { TransferState } from '@angular/platform-browser'
import {
  ServerModule,
  ServerTransferStateModule
} from '@angular/platform-server'
import {
  ROLLBAR_CONFIG,
  ROLLBAR_TS_KEY
} from '../../client/app/shared/services/error-handlers/global-error-handler.service'
import { AppModule } from './../../client/app/app.module'
import { WINDOW } from '../../client/app/shared/services/utlities/window.service'
import { REQUEST } from '@nguniversal/express-engine/tokens'
import {
  ENV_CONFIG,
  ENV_CONFIG_TS_KEY,
  IRequest,
  REQUEST_TS_KEY
} from '../../client/app/app.config'
import { LOGGER_CONFIG } from '../../client/app/shared/services/logging.service'
import { MinifierService } from '../../client/app/shared/services/utlities/minifier.service'
import { ServerResponseService } from './server.response.service'
import { ServerSvgLoaderService } from './server.svg-loader.service'
import {
  AUTH0_CLIENT,
  AUTH0_USER_TRANSFER,
  AUTH0_VALIDATION_FACTORY
} from '../../client/app/shared/services/auth.service'
import { Observable } from 'rxjs/Observable'
import { verify } from 'jsonwebtoken'
import { Observer } from 'rxjs/Observer'
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpHeaders
} from '@angular/common/http'
import { EnvironmentService } from '../../client/app/shared/services/environment.service'
import * as express from 'express'
import * as cleanCss from 'clean-css'
import * as Rollbar from 'rollbar'
import { HttpServerInterceptor } from './server.http-absolute'
import { filter, first, take, tap } from 'rxjs/operators'
import { of } from 'rxjs/observable/of'
import { RouteDataService } from '../../client/app/shared/services/route-data.service'
import { Router } from '@angular/router'
import { STATIC_ROUTE_RESPONSE_MAP } from './server.static-response'
import { CookieService } from '../../client/app/shared/services/cookie.service'
import { CookieService as ServerCookieService } from './cookie.service'
import { ResponseService } from '../../client/app/shared/services/response.service'
import { FirebaseServerModule } from './firebase/firebase-server.module'
// import { WebSocketService } from '../../client/app/shared/services/web-socket.service'
// import { ServerWebSocketService } from './server.websocket.service'

const envConfig = JSON.parse(process.env.ngConfig || '') as EnvConfig
envConfig.env !== 'dev' && enableProdMode()

export function globalInitialInjections(es: EnvironmentService) {
  return [
    {
      inHead: true,
      element: 'base',
      attributes: {
        href: '/' // TODO: es.config.siteUrl, might be needed for PWA
      }
    },
    process.env.GOOGLE_VERIFICATION_CODE && {
      inHead: true,
      element: 'meta',
      attributes: {
        name: 'google-site-verification',
        content: process.env.GOOGLE_VERIFICATION_CODE
      }
    },
    process.env.GOOGLE_ANALYTICS_TRACKING_ID && {
      inHead: true,
      element: 'script',
      // tslint:disable-next-line:max-line-length
      value: `window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;ga('create','${
        process.env.GOOGLE_ANALYTICS_TRACKING_ID
      }','auto');`,
      attributes: {
        async: true
      }
    },
    process.env.GOOGLE_ANALYTICS_TRACKING_ID && {
      inHead: false,
      element: 'script',
      attributes: {
        src: 'https://www.google-analytics.com/analytics.js',
        async: true
      }
    }
  ].filter(Boolean) as ReadonlyArray<DOMInjectable>
}

export function fuseBoxConfigFactory() {
  return envConfig
}

export function onBootstrap(
  appRef: ApplicationRef,
  transferState: TransferState,
  req: express.Request
) {
  return () => {
    appRef.isStable.pipe(filter(Boolean), first(), take(1)).subscribe(() => {
      transferState.set<string | undefined>(
        ROLLBAR_TS_KEY,
        process.env.ROLLBAR_CLIENT_ACCESS_TOKEN
      )
      transferState.set<EnvConfig | undefined>(ENV_CONFIG_TS_KEY, envConfig)
      transferState.set<IRequest>(REQUEST_TS_KEY, {
        hostname: req.hostname,
        entryReferer: req.get('referer')
      })
    })
  }
}

export function onInit(is: InjectionService, es: EnvironmentService) {
  return () =>
    is
      .injectCollection(globalInitialInjections(es))
      .pipe(take(1))
      .subscribe()
}

export function rollbarFactory(ts: TransferState) {
  const accessToken = process.env.ROLLBAR_ACCESS_TOKEN
  return (
    accessToken &&
    new Rollbar({
      accessToken,
      captureUncaught: true,
      captureUnhandledRejections: true
    })
  )
}

export const verifyLocally = (idToken: string, cert: string) => {
  return Observable.create((obs: Observer<any>) => {
    verify(idToken, cert.replace(/\\n/g, '\n') || '', (err, profile) => {
      if (err) {
        obs.error(err)
        obs.complete()
      } else {
        obs.next(profile)
        obs.complete()
      }
    })
  })
}

export const verifyRemotely = (
  accessToken: string,
  http: HttpClient,
  az: auth0.WebAuth
) => {
  return http.get<auth0.Auth0UserProfile>(
    `${(az.client as any).baseOptions.rootUrl}/userinfo`,
    {
      headers: new HttpHeaders({ Authorization: `Bearer ${accessToken}` })
    }
  )
}

export function auth0ServerValidationFactory(
  ts: TransferState,
  http: HttpClient,
  az: auth0.WebAuth
) {
  return (accessToken?: string, idToken?: string) => {
    const cert = process.env.AUTH0_CERT
    return (!cert || !idToken
      ? accessToken ? verifyRemotely(accessToken, http, az) : of(undefined)
      : verifyLocally(idToken, cert.replace(/\\n/g, '\n') || '')
    ).pipe(tap((user: any) => ts.set(AUTH0_USER_TRANSFER, user)))
  }
}

@NgModule({
  imports: [
    ServerModule,
    ServerTransferStateModule,
    AppModule,
    FirebaseServerModule
  ],
  providers: [
    { provide: WINDOW, useValue: {} },
    { provide: ResponseService, useClass: ServerResponseService },
    { provide: ENV_CONFIG, useFactory: fuseBoxConfigFactory },
    { provide: CookieService, useClass: ServerCookieService },
    { provide: SVGLoaderService, useClass: ServerSvgLoaderService },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpServerInterceptor,
      multi: true
    },
    {
      provide: AUTH0_VALIDATION_FACTORY,
      useFactory: auth0ServerValidationFactory,
      deps: [TransferState, HttpClient, AUTH0_CLIENT]
    },
    {
      provide: ROLLBAR_CONFIG,
      useFactory: rollbarFactory,
      deps: [TransferState]
    },
    {
      provide: APP_BOOTSTRAP_LISTENER,
      useFactory: onBootstrap,
      deps: [ApplicationRef, TransferState, REQUEST],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: onInit,
      deps: [InjectionService],
      multi: true
    },
    {
      provide: LOGGER_CONFIG,
      useValue: {
        name: 'Universal WebApp',
        type: 'server-side'
      }
    },
    {
      provide: MinifierService,
      useValue: {
        css(css: string): string {
          return new cleanCss({}).minify(css).styles || css
        }
      }
    }
    // {
    //   provide: WebSocketService,
    //   useClass: ServerWebSocketService
    // }
  ],
  bootstrap: [AppComponent]
})
export class AppServerModule {
  constructor(srs: ResponseService, rd: RouteDataService, rt: Router) {
    rd.data.pipe(take(1)).subscribe(def => {
      const map = (STATIC_ROUTE_RESPONSE_MAP || {})[def.componentName]
      map && Object.keys(map).forEach(k => srs.setHeader(k, map[k]))
    })
  }
}
