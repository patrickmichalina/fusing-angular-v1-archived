import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import { verify } from 'jsonwebtoken'
import * as auth0 from 'auth0-js'
import * as config from '../../config.json'

export const azNoAngular = new auth0.WebAuth({
  ...(config as any).auth0
})

export const verifyLocally = (idToken: string, cert: string) => {
  return Observable.create((obs: Observer<any>) => {
    verify(idToken, cert.replace(/\\n/g, '\n') || '', (err, profile) => {
      if (err) {
        obs.error(err)
        obs.complete()
      } else {
        obs.next(profile)
        obs.complete()
      }
    })
  })
}

export const auth0ServerValidationNoAngularFactory = (
  a0: auth0.WebAuth,
  accessToken?: string,
  idToken?: string
): Observable<auth0.Auth0UserProfile | undefined> => {
  if (!accessToken || !idToken) return Observable.of(undefined)
  const cert = process.env.AUTH0_CERT
  return !cert || !idToken
    ? accessToken
      ? verifyRemotely(azNoAngular, accessToken)
      : Observable.of(undefined)
    : verifyLocally(idToken, cert.replace(/\\n/g, '\n') || '')
}

export const verifyRemotely = (
  a0: auth0.WebAuth,
  accessToken: string
): Observable<auth0.Auth0UserProfile> => {
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
