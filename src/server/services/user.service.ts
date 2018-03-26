import { Inject, Service } from 'typedi'
// tslint:disable:import-blacklist
import { Authentication, Management } from 'auth0-js'
import {
  AUTH0_CERT,
  AUTH0_MANAGEMENT_CLIENT_CONFIG,
  Auth0Cert,
  Auth0Config
} from '../rest-api'
import { Observable, Observer, of } from 'rxjs'
import { flatMap, map } from 'rxjs/operators'
import { verify } from 'jsonwebtoken'

@Service()
export class UserService {
  private readonly client = new Authentication(this.config)
  // tslint:disable-next-line:readonly-keyword
  private token: string

  constructor(
    @Inject(type => AUTH0_MANAGEMENT_CLIENT_CONFIG)
    private config: Auth0Config,
    @Inject(type => AUTH0_CERT)
    private cert: Auth0Cert
  ) {}

  fetchAccessToken(auth0: Authentication): Observable<string> {
    return Observable.create((obs: Observer<string>) => {
      auth0.oauthToken(
        {
          grantType: 'client_credentials',
          audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
          clientSecret: process.env.AUTH0_CLIENT_SECRET
        },
        (err, response) => {
          if (err) {
            obs.error(err)
            obs.complete()
          } else {
            // tslint:disable-next-line:no-object-mutation
            this.token = response.accessToken
            obs.next(response.accessToken)
            obs.complete()
          }
        }
      )
    })
  }

  getValidToken() {
    return this.token && verify(this.token, this.cert)
      ? of(this.token)
      : this.fetchAccessToken(this.client)
  }

  getClient(): Observable<Management> {
    return this.getValidToken().pipe(
      map(
        token =>
          new Management({
            domain: process.env.AUTH0_DOMAIN || '',
            token
          })
      )
    )
  }

  getUser(userId: string) {
    return this.getClient().pipe(
      flatMap(client => this.getUserObs(client, userId))
    )
  }

  updateUserMetadata(userId: string, meta: any) {
    return this.getClient().pipe(
      flatMap(client => this.updateUserMetadataObs(client, userId, meta))
    )
  }

  getUserObs(client: Management, userId: string): Observable<any> {
    return Observable.create((obs: Observer<any>) => {
      client.getUser(userId, (err, user) => {
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

  updateUserMetadataObs(client: Management, userId: string, meta: any) {
    return Observable.create((obs: Observer<any>) => {
      client.patchUserMetadata(userId, meta, (err, user) => {
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
}
