import { Observable } from 'rxjs/Observable'
import { Injectable } from '@angular/core'
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http'
import { EnvironmentService } from '../../client/app/shared/services/environment.service'

@Injectable()
export class HttpServerInterceptor implements HttpInterceptor {
  constructor(private env: EnvironmentService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // handles absolute http requests
    if (req.url.includes('http')) return next.handle(req)

    return next.handle(
      req.clone({
        url: `${this.env.config.siteUrl}/${req.url.replace('./', '')}`
      })
    )
  }
}
