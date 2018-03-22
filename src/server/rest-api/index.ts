// tslint:disable:no-require-imports

import { parse } from 'cookie'
import {
  Action,
  useContainer,
  useExpressServer as configApi
} from 'routing-controllers'
import { controllers } from './controllers'
import { middlewares } from './middlewares'
import { Container } from 'typedi'
import {
  appAuthAccessTokenKey,
  appAuthIdTokenKey
} from '../../client/app/app.module'
import { auth0ServerValidationNoAngularFactory, azNoAngular } from './helpers'
import * as express from 'express'
import * as bodyParser from 'body-parser'

const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

useContainer(Container)

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
        .map(user => {
          const uroles =
            (user && (user as any)[process.env.AUTH0_ROLES_KEY as string]) || {}
          const userRoles: ReadonlyArray<string> = Object.keys(uroles).filter(
            key => uroles[key]
          )
          const userHasPermission =
            user && userRoles.some(role => roles.some(r => r === role))
          return userHasPermission
        })
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
      undefinedResultCode: 204
    }
  } as any)
}
