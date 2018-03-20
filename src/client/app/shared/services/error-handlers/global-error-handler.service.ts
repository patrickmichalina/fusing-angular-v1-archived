import * as Rollbar from 'rollbar'
import {
  ErrorHandler,
  Inject,
  Injectable,
  InjectionToken,
  Injector
} from '@angular/core'
import { makeStateKey } from '@angular/platform-browser'
import { LoggingService } from '../logging.service'
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga'
import { WindowService } from '../utlities/window.service'

export const ROLLBAR_CONFIG = new InjectionToken<Rollbar>('cfg.rb')
export const ROLLBAR_TS_KEY = makeStateKey<string>('cfg.rb.ts')

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
    @Inject(ROLLBAR_CONFIG) private rollbar: Rollbar | undefined,
    private inj: Injector
  ) {}

  // tslint:disable:no-console
  handleError(err: any): void {
    const log = this.inj.get(LoggingService)
    const ws = this.inj.get(WindowService)
    const analytics = this.inj.get(Angulartics2GoogleAnalytics)

    try {
      this.rollbar && this.rollbar.error(err.originalError || err)
      log && log.error(err.originalError || err)
      typeof ws.window<any>().ga !== 'undefined' &&
        analytics.exceptionTrack(err.originalError || err)
    } catch (err) {
      // noop
    }
  }
}
