import * as Rollbar from 'rollbar'
import {
  ErrorHandler,
  Inject,
  Injectable,
  InjectionToken
} from '@angular/core'
import { makeStateKey } from '@angular/platform-browser'

export const ROLLBAR_CONFIG = new InjectionToken<Rollbar>('app.rollbar')
export const ROLLBAR_TS_KEY = makeStateKey<string>('app.rollbar.ts')

@Injectable()
export class RollbarErrorHandler implements ErrorHandler {
  constructor(@Inject(ROLLBAR_CONFIG) private rollbar: Rollbar | undefined) { }

  handleError(err: any): void {
    this.rollbar && this.rollbar.error(err.originalError || err)
    !this.rollbar && console.error(err.originalError || err)
  }
}
