import { REQUEST } from '@nguniversal/express-engine/tokens'
import { PlatformService } from './platform.service'
import { Inject, Injectable } from '@angular/core'
import { Subject } from 'rxjs/Subject'
import { getJSON, remove, set } from 'js-cookie'
import { IStorageProvider } from '../auth/tokens'

@Injectable()
export class CookieService implements IStorageProvider {
  private readonly cookieSource = new Subject<{ readonly [key: string]: any }>()
  public readonly valueChanges = this.cookieSource.asObservable()

  constructor(private ps: PlatformService, @Inject(REQUEST) private req: any) {}

  public set(name: string, value: any): void {
    if (this.ps.isBrowser) {
      set(name, value)
      this.updateSource()
    }
  }

  public remove(name: string): void {
    if (this.ps.isBrowser) {
      remove(name)
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
