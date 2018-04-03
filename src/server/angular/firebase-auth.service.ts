import { Inject, Injectable } from '@angular/core'
// tslint:disable-next-line:import-blacklist
import { Subject } from 'rxjs'
import { REQUEST } from '@nguniversal/express-engine/tokens'

@Injectable()
export class AngularFireAuthService {
  readonly authSource = new Subject<any | undefined>()
  readonly idToken = this.authSource.asObservable()

  constructor(@Inject(REQUEST) private req: any) {
    const fbAuth = this.req.cookies['fbAuth']
    // console.log('HERERERE', fbAuth)
    // this.idToken.subscribe(console.log)
    if (fbAuth) {
      this.authSource.next({
        getIdToken: () => {
          return new Promise((resolve: any) => {
            resolve(fbAuth)
          })
        }
      })
    } else {
      this.authSource.next(undefined)
    }
  }
}
