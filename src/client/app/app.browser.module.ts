import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser'
import { AppModule } from './app.module'
import { NgModule } from '@angular/core'
import { AppComponent } from './app.component'
// import { ServiceWorkerModule } from '@angular/service-worker'
// import { Observable } from 'rxjs/Observable'
import 'hammerjs'

// const sw = process.env.NODE_ENV !== 'development' && [ServiceWorkerModule.register('./ngsw-worker.js')] || []

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'pm-app' }),
    BrowserTransferStateModule,
    BrowserAnimationsModule,
    AppModule]
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
