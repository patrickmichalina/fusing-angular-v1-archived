// tslint:disable-next-line:import-blacklist
import { empty } from 'rxjs'
import { REQUEST } from '@nguniversal/express-engine/tokens'
import { Inject, Injectable } from '@angular/core'
import { CookieAttributes } from 'js-cookie'
import { ICookieService } from '../../client/app/shared/services/cookie.service'
import { Request } from 'express'

@Injectable()
export class CookieService implements ICookieService {
  public readonly valueChanges = empty()

  constructor(@Inject(REQUEST) private req: Request) {}

  public get(name: string): any {
    try {
      return JSON.parse(this.req.cookies[name])
    } catch (err) {
      return this.req ? this.req.cookies[name] : undefined
    }
  }

  public getAll(): any {
    return this.req && this.req.cookies
  }

  public set(name: string, value: any, opts?: CookieAttributes): void {
    // noop
  }

  public remove(name: string, opts?: CookieAttributes): void {
    // noop
  }

  updateSource() {
    // noop
  }
}
