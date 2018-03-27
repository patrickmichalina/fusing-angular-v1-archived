import { Injectable } from '@angular/core'
import { Subject } from 'rxjs/Subject'
import { CookieAttributes, getJSON, remove, set } from 'js-cookie'
import { Observable } from 'rxjs/Observable'

export interface ICookieService {
  readonly valueChanges: Observable<{ readonly [key: string]: any }>
  getAll(): any
  get(name: string): any
  set(name: string, value: any, options?: CookieAttributes): void
  remove(name: string, options?: CookieAttributes): void
}

@Injectable()
export class CookieService implements ICookieService {
  private readonly cookieSource = new Subject<{ readonly [key: string]: any }>()
  public readonly valueChanges = this.cookieSource.asObservable()

  public set(name: string, value: any, opts?: CookieAttributes): void {
    set(name, value, opts)
    this.updateSource()
  }

  public remove(name: string, opts?: CookieAttributes): void {
    remove(name, opts)
    this.updateSource()
  }

  public get(name: string): any {
    return getJSON(name)
  }

  public getAll(): any {
    return getJSON()
  }

  private updateSource() {
    this.cookieSource.next(this.getAll())
  }
}
