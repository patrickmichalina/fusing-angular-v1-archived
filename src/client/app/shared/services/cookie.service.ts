import { REQUEST } from '@nguniversal/express-engine/tokens'
import { PlatformService } from './platform.service'
import { Inject, Injectable } from '@angular/core'
import { Subject } from 'rxjs/Subject'
import { CookieAttributes, getJSON, remove, set } from 'js-cookie'

@Injectable()
export class CookieService {
  private readonly cookieSource = new Subject<{ readonly [key: string]: any }>()
  public readonly valueChanges = this.cookieSource.asObservable()

  constructor(private ps: PlatformService, @Inject(REQUEST) private req: any) {}

  public set(name: string, value: any, opts?: CookieAttributes): void {
    if (this.ps.isBrowser) {
      set(name, value, opts)
      this.updateSource()
    }
  }

  public remove(name: string, opts?: CookieAttributes): void {
    if (this.ps.isBrowser) {
      remove(name, opts)
      this.updateSource()
    }
  }

  public get(name: string): any {
    if (this.ps.isBrowser) {
      return getJSON(name)
    } else {
      try {
        return JSON.parse(this.req.cookies[name])
      } catch (err) {
        return this.req ? this.req.cookies[name] : undefined
      }
    }
  }

  public getAll(): any {
    if (this.ps.isBrowser) {
      return getJSON()
    } else {
      if (this.req) return this.req.cookies
    }
  }

  private updateSource() {
    this.cookieSource.next(this.getAll())
  }
}
