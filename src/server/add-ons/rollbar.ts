import * as express from 'express'

// tslint:disable:no-require-imports
export const rollbarInit = (app: express.Application) => {
  if (process.env.ROLLBAR_ACCESS_TOKEN && process.env.ROLLBAR_ENDPOINT) {
    const rollbar = require('rollbar')
    const instance = new rollbar(process.env.ROLLBAR_ACCESS_TOKEN)
    app.use(instance.errorHandler())
  }
}
