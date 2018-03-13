import * as express from 'express'
import * as Rollbar from 'rollbar'

// tslint:disable:no-require-imports
export const rollbarInit = (app: express.Application) => {
  if (process.env.ROLLBAR_ACCESS_TOKEN && process.env.ROLLBAR_ENDPOINT) {
    const instance = new Rollbar({
      accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
      captureUncaught: true,
      captureUnhandledRejections: true
    }) as any
    app.use(instance.errorHandler())
  }
}
