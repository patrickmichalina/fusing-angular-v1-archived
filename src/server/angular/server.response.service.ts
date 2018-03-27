// tslint:disable:no-require-imports
// tslint:disable:no-object-mutation

import { RESPONSE } from '@nguniversal/express-engine/tokens'
import { Inject, Injectable } from '@angular/core'
import { IResponseService } from '../../client/app/shared/services/response.service'
import * as express from 'express'

export { IResponseService }

@Injectable()
export class ServerResponseService implements IResponseService {
  constructor(@Inject(RESPONSE) private response: express.Response) {}

  getHeader(key: string): string {
    return this.response.getHeader(key) as string
  }

  setHeader(key: string, value: string): void {
    this.response.header(key, value)
  }

  removeHeader(key: string): void {
    this.response.removeHeader(key)
  }

  appendHeader(key: string, value: string, delimiter = ','): void {
    const current = this.getHeader(key)

    if (!current) {
      this.setHeader(key, value)
    } else {
      const newValue = [...current.split(delimiter), value]
        .filter((el, i, a) => i === a.indexOf(el))
        .join(delimiter)

      this.response.header(key, newValue)
    }
  }

  setHeaders(dictionary: { readonly [key: string]: string }): void {
    Object.keys(dictionary).forEach(key => this.setHeader(key, dictionary[key]))
  }

  setStatus(code: number, message?: string): void {
    this.response.statusCode = code
    if (message) this.response.statusMessage = message
  }

  setNotFound(message = 'Not Found', code = 404): void {
    this.response.statusCode = code
    this.response.statusMessage = message
  }

  setUnauthorized(message = 'Unauthorized', code = 401): void {
    this.response.statusCode = code
    this.response.statusMessage = message
  }

  setError(message = 'Internal Server Error', code = 500): void {
    this.response.statusCode = code
    this.response.statusMessage = message
  }
}

// const ms = require('ms')
// export type HttpCacheDirective = 'public' | 'private' | 'no-store' | 'no-cache' | 'must-revalidate' | 'no-transform' | 'proxy-revalidate'
// setCachePrivate(): this {
//   if (this.response) {
//     this.setCache('private')
//   }
//   return this
// }

// setCacheNone(): this {
//   if (this.response) {
//     this.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
//     this.setHeader('Pragma', 'no-cache')
//   }
//   return this
// }

// setCache(directive: HttpCacheDirective, maxAge?: string, smaxAge?: string): this {
//   if (this.response) {
//     // tslint:disable-next-line:max-line-length
//     if (smaxAge) {
//       this.setHeader('Cache-Control', `${directive}, max-age=${maxAge ? ms(maxAge) / 1000 : 0}, s-maxage=${ms(smaxAge) / 1000}`)
//     } else {
//       this.setHeader('Cache-Control', `${directive}, max-age=${maxAge ? ms(maxAge) / 1000 : 0}`)
//     }

//     this.setHeader('Expires', maxAge ? new Date(Date.now() + ms(maxAge)).toUTCString() : new Date(Date.now()).toUTCString())
//   }
//   return this
// }
