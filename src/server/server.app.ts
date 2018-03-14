// tslint:disable:no-require-imports
import 'reflect-metadata'
import 'zone.js/dist/zone-node'
import 'zone.js/dist/long-stack-trace-zone'
import * as express from 'express'
import * as cookieParser from 'cookie-parser'
import { createLogger } from '@expo/bunyan'
import { ngExpressEngine } from '@nguniversal/express-engine'
import { AppServerModule } from './server.angular.module'
import { argv } from 'yargs'
import { resolve } from 'path'
import { rollbarInit } from './add-ons/rollbar'
import ms = require('ms')

const shrinkRay = require('shrink-ray')
const minifyHTML = require('express-minify-html')
const bunyanMiddleware = require('bunyan-middleware')
const xhr2 = require('xhr2')
const cors = require('cors')

// tslint:disable-next-line:no-object-mutation
xhr2.prototype._restrictedHeaders.cookie = false

require('ts-node/register')

const app = express()
rollbarInit(app)
const isProd = argv['build-type'] === 'prod' || argv['prod']

const staticOptions = {
  index: false,
  maxAge: isProd ? ms('1yr') : ms('0'),
  setHeaders: (res: express.Response, path: any) => {
    res.setHeader('Expires', isProd
      ? new Date(Date.now() + ms('1yr')).toUTCString()
      : new Date(Date.now() + ms('0')).toUTCString())
  }
}

const logger = createLogger({
  name: 'Fusing-Angular',
  type: 'node-only',
  streams: [{
    level: 'error',
    type: 'raw',
    stream: { write: (err: any) => console.log }
  }] as any
})

app.use(bunyanMiddleware({ logger, excludeHeaders: ['authorization', 'cookie'] }))

const dir = resolve('dist')

app.engine('html', ngExpressEngine({ bootstrap: AppServerModule }))
app.set('view engine', 'html')
app.set('views', dir)
app.use(cookieParser())
app.use(shrinkRay())
app.use(cors())
app.use(minifyHTML({
  override: true,
  exception_url: false,
  htmlMinifier: {
    removeComments: true,
    collapseWhitespace: true,
    collapseBooleanAttributes: true,
    removeAttributeQuotes: false,
    minifyJS: true
  }
}))

app.use('/css', express.static(`${dir}/css`, staticOptions))
app.use('/js', express.static(`${dir}/js`, staticOptions))
app.use('/ngsw.json', express.static(`${dir}/ngsw.json`, staticOptions))
app.use('/ngsw-worker.js', express.static(`${dir}/ngsw-worker.js`, staticOptions))
app.use('/robots.txt', express.static(`${dir}/web/robots.txt`, staticOptions))
app.use('/assets', express.static(`${dir}/assets`, { ...staticOptions, fallthrough: false }))
app.use('/manifest.json', express.static(`${dir}/assets`, { ...staticOptions, fallthrough: false }))
app.use('/favicon.ico', express.static(`${dir}/assets/favicons/favicon-16x16.png`, { ...staticOptions, fallthrough: false }))

app.get('**', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  return res.render('index', {
    req,
    res
  })
})

export { app }
