import { MinifierService } from '../../client/app/shared/services/utlities/minifier.service'
import {
  ENV_CONFIG,
  ENV_CONFIG_TS_KEY,
  IRequest,
  REQUEST_TS_KEY
} from '../../client/app/app.config'
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
import { ServerResponseService } from './server.response.service'
import { ResponseService } from '../../client/app/shared/services/response.service'
import { LOGGER_CONFIG } from '../../client/app/shared/services/logging.service'
import * as express from 'express'
import * as cleanCss from 'clean-css'
import * as Rollbar from 'rollbar'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/first'
import '../../client/operators'
import { InjectionService } from '../../client/app/shared/services/injection.service'

const envConfig = JSON.parse(process.env.ngConfig || '') as EnvConfig
envConfig.env !== 'dev' && enableProdMode()

export function fuseBoxConfigFactory() {
  return envConfig
}

export function onBootstrap(
  appRef: ApplicationRef,
  transferState: TransferState,
  req: express.Request
) {
  return () => {
    appRef.isStable
      .filter(Boolean)
      .first()
      .take(1)
      .subscribe(() => {
        transferState.set<string | undefined>(
          ROLLBAR_TS_KEY,
          process.env.ROLLBAR_ACCESS_TOKEN
        )
        transferState.set<EnvConfig | undefined>(ENV_CONFIG_TS_KEY, envConfig)
        transferState.set<IRequest>(REQUEST_TS_KEY, {
          hostname: req.hostname,
          entryReferer: req.get('referer')
        })
      })
  }
}

export function onInit(is: InjectionService) {
  return () =>
    is
      .injectCollection([
        {
          element: 'script',
          attributes: {
            src: 'https://buttons.github.io/buttons.js',
            async: true,
            defer: true
          },
          inHead: true
        }
      ])
      .take(1)
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

@NgModule({
  imports: [ServerModule, ServerTransferStateModule, AppModule],
  providers: [
    { provide: WINDOW, useValue: {} },
    { provide: ENV_CONFIG, useFactory: fuseBoxConfigFactory },
    { provide: ResponseService, useClass: ServerResponseService },
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
  ],
  bootstrap: [AppComponent]
})
export class AppServerModule {}
