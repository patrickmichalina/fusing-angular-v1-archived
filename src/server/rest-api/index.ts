// tslint:disable:no-require-imports

import { parse } from 'cookie'
import {
  Action,
  useContainer,
  useExpressServer as configApi
} from 'routing-controllers'
import { controllers } from './controllers'
import { middlewares } from './middlewares'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import { Container } from 'typedi'
import * as auth0 from 'auth0-js'
import * as config from '../../config.json'
import { verifyLocally } from '../angular/server.angular.module'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import {
  appAuthAccessTokenKey,
  appAuthIdTokenKey
} from '../../client/app/app.module'

const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

useContainer(Container)

const az = new auth0.WebAuth({
  ...(config as any).auth0
})

function verifyRemotely(
  a0: auth0.WebAuth,
  accessToken: string
): Observable<auth0.Auth0UserProfile> {
  return Observable.create((obs: Observer<auth0.Auth0UserProfile>) => {
    a0.client.userInfo(accessToken, (err, user) => {
      if (err) {
        obs.error(err)
        obs.complete()
      } else {
        obs.next(user)
        obs.complete()
      }
    })
  })
}

function auth0ServerValidationFactory(
  a0: auth0.WebAuth,
  accessToken?: string,
  idToken?: string
): Observable<auth0.Auth0UserProfile | undefined> {
  if (!accessToken || !idToken) return Observable.of(undefined)
  const cert = process.env.AUTH0_CERT
  return !cert || !idToken
    ? accessToken ? verifyRemotely(az, accessToken) : Observable.of(undefined)
    : verifyLocally(idToken, cert.replace(/\\n/g, '\n') || '')
}

export const useApi = (app: express.Application) => {
  const swaggerSpec = swaggerJSDoc({
    swaggerDefinition: {
      info: {
        title: 'fusing-angular',
        description: '',
        termsOfService: '',
        contact: {
          name: 'Patrick Michalina',
          url: 'https://github.com/patrickmichalina/fusing-angular/issues',
          email: 'patrickmichalina@mac.com'
        },
        license: {
          name: 'MIT',
          url:
            'https://github.com/patrickmichalina/fusing-angular/blob/master/LICENSE'
        },
        version: '1.0.0'
      }
    },
    apis: [
      './src/server/entity/**/*.ts',
      './src/server/rest-api/controllers/**/*.ts'
    ]
  })

  app.use('/api/**', bodyParser.json())
  app.use('/api/**', bodyParser.urlencoded({ extended: false }))
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

  const getTokenFromAction = (action: Action) => {
    const clientAccessToken =
      action.request.headers.cookie &&
      parse(action.request.headers.cookie as any)[appAuthAccessTokenKey]
    const clientIdToken =
      action.request.headers.cookie &&
      parse(action.request.headers.cookie as any)[appAuthIdTokenKey]

    return {
      clientAccessToken,
      clientIdToken
    }
  }

  configApi(app, {
    authorizationChecker: (action: Action, roles: ReadonlyArray<string>) => {
      const tokenTuple = getTokenFromAction(action)
      return auth0ServerValidationFactory(
        az,
        tokenTuple.clientAccessToken,
        tokenTuple.clientIdToken
      )
        .map(user => {
          const userRoles: ReadonlyArray<string> = []
          const userHasPermission =
            user && userRoles.some(role => roles.some(r => r === role))
          return userHasPermission
        })
        .take(1)
        .toPromise()
    },
    currentUserChecker: (action: Action) => {
      const tokenTuple = getTokenFromAction(action)
      return auth0ServerValidationFactory(
        az,
        tokenTuple.clientAccessToken,
        tokenTuple.clientIdToken
      ).toPromise()
    },
    cors: true,
    validation: true,
    routePrefix: '/api',
    controllers,
    middlewares,
    defaultErrorHandler: false,
    defaults: {
      nullResultCode: 404,
      undefinedResultCode: 204
    }
  } as any)
}
