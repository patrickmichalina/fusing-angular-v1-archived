import { REQUEST } from '@nguniversal/express-engine/tokens'
import { AppModule } from './../client/app/app.module'
import { AppComponent } from './../client/app/app.component'
import { EnvConfig } from '../../tools/config/app.config'
import { APP_BOOTSTRAP_LISTENER, ApplicationRef, enableProdMode, NgModule } from '@angular/core'
import { MinifierService } from '../client/app/shared/services/minifier.service'
import { TransferState } from '@angular/platform-browser'
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server'
import { ROLLBAR_CONFIG, ROLLBAR_TS_KEY } from '../client/app/shared/services/error-handlers/rollbar.error-handler.service'
import * as express from 'express'
import * as cleanCss from 'clean-css'
import * as Rollbar from 'rollbar'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/first'
import '../client/operators'

declare var __process_env__: EnvConfig

__process_env__.env !== 'dev' && enableProdMode()

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
        transferState.set<any>(ROLLBAR_TS_KEY, process.env.ROLLBAR_ACCESS_TOKEN)
      })
  }
}

export function rollbarFactory(ts: TransferState) {
  const accessToken = process.env.ROLLBAR_ACCESS_TOKEN
  return accessToken && new Rollbar({
    accessToken,
    captureUncaught: true,
    captureUnhandledRejections: true
  })
}

@NgModule({
  imports: [
    ServerModule,
    ServerTransferStateModule,
    AppModule
  ],
  providers: [
    { provide: ROLLBAR_CONFIG, useFactory: rollbarFactory, deps: [TransferState] },
    {
      provide: APP_BOOTSTRAP_LISTENER,
      useFactory: onBootstrap,
      multi: true,
      deps: [ApplicationRef, TransferState, REQUEST]
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
export class AppServerModule { }
