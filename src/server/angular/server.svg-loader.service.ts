import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import { ISVGLoaderService } from '../../client/app/shared/svg/svg-loader.service'
import { makeStateKey, TransferState } from '@angular/platform-browser'
import { SVG_TRANSFER_KEY } from '../../client/app/shared/svg/svg.directive'
import { readFile } from 'fs'
import { Observer } from 'rxjs/Observer'

@Injectable()
export class ServerSvgLoaderService implements ISVGLoaderService {
  constructor(private ts: TransferState) {}

  load(name: string): Observable<string> {
    return Observable.create((observer: Observer<string>) => {
      readFile(`./dist/assets/svg/${name}.svg`, (err, cb) => {
        if (err) {
          observer.error(err)
          observer.complete()
        } else {
          observer.next(cb.toString())
          observer.complete()
        }
      })
    }).do((svg: string) => this.cacheForBrowserReflow(name, svg))
  }

  cacheForBrowserReflow(name: string, svg: string) {
    const current = this.ts.get(makeStateKey(SVG_TRANSFER_KEY), {})
    this.ts.set(makeStateKey(SVG_TRANSFER_KEY), { ...current, [name]: svg })
  }
}
