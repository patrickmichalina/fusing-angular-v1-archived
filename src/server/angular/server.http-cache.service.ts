// tslint:disable:no-require-imports
// tslint:disable:no-object-mutation

import { Injectable } from '@angular/core'
import { ResponseService } from '../../client/app/shared/services/response.service'
// import * as express from 'express'
// const ms = require('ms')

export type HttpCacheDirective =
  | 'public'
  | 'private'
  | 'no-store'
  | 'no-cache'
  | 'must-revalidate'
  | 'no-transform'
  | 'proxy-revalidate'

@Injectable()
export class ServerHttpCacheService {
  constructor(public rs: ResponseService) {}

  setCacheControl() {
    this.rs.setHeader('Cache-Control', 'public, max-age=123')
  }
  // quick recipes
}

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
