// tslint:disable:no-require-imports

import { parse } from 'cookie'
import {
  Action,
  useContainer,
  useExpressServer as configApi
} from 'routing-controllers'
import { controllers } from './controllers'
import { middlewares } from './middlewares'
import { Container, Token } from 'typedi'
import {
  appAuthAccessTokenKey,
  appAuthIdTokenKey
} from '../../client/app/app.module'
import { auth0ServerValidationNoAngularFactory, azNoAngular } from './helpers'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import { map } from 'rxjs/operators'
import { AuthOptions } from 'auth0-js'

const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

useContainer(Container)

export type Auth0Config = AuthOptions
export type SendGridAPIKey = string
export type Auth0Cert = string
export const AUTH0_MANAGEMENT_CLIENT_CONFIG = new Token<Auth0Config>()
export const SENDGRID_API_KEY = new Token<SendGridAPIKey>()
export const AUTH0_CERT = new Token<Auth0Cert>()

Container.set(
  AUTH0_CERT,
  process.env.AUTH0_CERT && process.env.AUTH0_CERT.replace(/\\n/g, '\n')
)
Container.set(SENDGRID_API_KEY, process.env.SENDGRID_API_KEY)
Container.set(AUTH0_MANAGEMENT_CLIENT_CONFIG, {
  domain: process.env.AUTH0_DOMAIN || '',
  clientID: process.env.AUTH0_CLIENT_ID || ''
} as AuthOptions)

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
      },
      securityDefinitions: {
        auth: {
          type: 'oauth2',
          authorizationUrl: `https://${process.env.AUTH0_DOMAIN}/authorize`,
          tokenUrl: `https://${process.env.AUTH0_DOMAIN}/token`,
          flow: 'implicit',
          responseType: 'token id_token',
          scopes: {
            openid: 'profile',
            profile: 'profile'
          }
        }
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

  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, undefined, {
      oauth2RedirectUrl: `${
        process.env.SITE_URL
      }/api-docs/oauth2-redirect.html`,
      oauth: {
        clientId: process.env.AUTH0_CLIENT_ID
      }
    })
  )

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
    authorizationChecker: async (
      action: Action,
      roles: ReadonlyArray<string>
    ) => {
      const tokenTuple = getTokenFromAction(action)
      return auth0ServerValidationNoAngularFactory(
        azNoAngular,
        tokenTuple.clientAccessToken,
        tokenTuple.clientIdToken
      )
        .pipe(
          map(user => {
            const uroles =
              (user && (user as any)[process.env.AUTH0_ROLES_KEY as string]) ||
              {}
            const userRoles: ReadonlyArray<string> = Object.keys(uroles).filter(
              key => uroles[key]
            )
            const userHasPermission =
              user && userRoles.some(role => roles.some(r => r === role))
            return userHasPermission
          })
        )
        .toPromise()
    },
    currentUserChecker: (action: Action) => {
      const tokenTuple = getTokenFromAction(action)
      return auth0ServerValidationNoAngularFactory(
        azNoAngular,
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
      undefinedResultCode: 404
    }
  } as any)
}
