import * as Rollbar from 'rollbar'
import { ErrorHandler, Inject, Injectable, InjectionToken } from '@angular/core'
import { makeStateKey } from '@angular/platform-browser'

export const ROLLBAR_CONFIG = new InjectionToken<Rollbar>('cfg.rb')
export const ROLLBAR_TS_KEY = makeStateKey<string>('cfg.rb.ts')

@Injectable()
export class RollbarErrorHandler implements ErrorHandler {
  constructor(@Inject(ROLLBAR_CONFIG) private rollbar: Rollbar | undefined) {}

  // tslint:disable:no-console
  handleError(err: any): void {
    this.rollbar && this.rollbar.error(err.originalError || err)
    console.error(err.originalError || err)
  }
}
