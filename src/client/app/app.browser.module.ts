import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import {
  BrowserModule,
  BrowserTransferStateModule,
  TransferState
} from '@angular/platform-browser'
import { AppModule } from './app.module'
import { NgModule } from '@angular/core'
import { AppComponent } from './app.component'
import { ENV_CONFIG, ENV_CONFIG_TS_KEY, REQUEST_TS_KEY } from './app.config'
import { WINDOW } from './shared/services/utlities/window.service'
import { REQUEST } from '@nguniversal/express-engine/src/tokens'
// import { ServiceWorkerModule } from '@angular/service-worker'
// import { Observable } from 'rxjs/Observable'
import 'hammerjs'
import { ResponseService } from './shared/services/response.service'

// const sw = process.env.NODE_ENV !== 'development' && [ServiceWorkerModule.register('./ngsw-worker.js')] || []

export function fuseBoxConfigFactory(ts: TransferState) {
  return ts.get(ENV_CONFIG_TS_KEY, {})
}

export function requestFactory(transferState: TransferState): any {
  return transferState.get<any>(REQUEST_TS_KEY, {})
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
    { provide: WINDOW, useValue: window },
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
    ResponseService
  ]
})
export class AppBrowserModule {
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
