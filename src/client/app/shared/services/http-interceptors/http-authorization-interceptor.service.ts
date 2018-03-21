import { REQUEST } from '@nguniversal/express-engine/tokens'
import { Observable } from 'rxjs/Observable'
import { Inject, Injectable, InjectionToken, Injector } from '@angular/core'
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http'
import { AuthService } from '../auth.service'
import { UrlService } from '../url.service'
import { PlatformService } from '../platform.service'
import * as express from 'express'

export interface AuthBearerHosts {
  readonly [key: string]: boolean
}
export const AUTH_BEARER_HOSTS = new InjectionToken<AuthBearerHosts>(
  'auth.bearer.hosts'
)

@Injectable()
export class HttpAuthInterceptor implements HttpInterceptor {
  constructor(
    @Inject(AUTH_BEARER_HOSTS) private bearerHosts: AuthBearerHosts,
    private ps: PlatformService,
    private injector: Injector,
    private us: UrlService
  ) {}

  useBearerCredentials(req: HttpRequest<any>) {
    const key = this.us.getHost(req.url) || ''
    return (this.bearerHosts || {})[key]
  }

  get bearerToken() {
    const token = this.injector.get(AuthService).getValidToken()
    return token ? `Bearer ${token}` : undefined
  }

  get serverCookies() {
    const serverRequest = this.injector.get(REQUEST) as express.Request

    return Object.keys(serverRequest.cookies || {}).reduce(
      (accumulator, cookieName) =>
        `${accumulator}${cookieName}=${serverRequest.cookies[cookieName]};`,
      ''
    )
  }

  bearerTokenBasedRequest(req: HttpRequest<any>) {
    return !this.bearerToken
      ? req.clone({ withCredentials: false })
      : req.clone({
          withCredentials: false,
          headers: req.headers.set('Authorization', this.bearerToken)
        })
  }

  cookieBasedRequest(req: HttpRequest<any>) {
    return this.ps.isBrowser
      ? req.clone({ withCredentials: true })
      : req.clone({
          withCredentials: true,
          headers: req.headers.set('Cookie', this.serverCookies)
        })
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.useBearerCredentials(req)
      ? next.handle(this.bearerTokenBasedRequest(req))
      : next.handle(this.cookieBasedRequest(req))
  }
}
