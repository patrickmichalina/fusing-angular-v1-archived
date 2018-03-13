import * as Rollbar from 'rollbar'
import * as express from 'express'

export const rollbar = (app: express.Application) => {
  if (process.env.ROLLBAR_ACCESS_TOKEN && process.env.ROLLBAR_ENDPOINT) {
    const rb = new Rollbar({
      accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
      endpoint: process.env.ROLLBAR_ENDPOINT
    })
    app.use(rb.lambdaHandler)
  }
}
