import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'

@Injectable()
export class MockCookieService {
  private readonly cookieSource = new BehaviorSubject<{
    readonly [key: string]: any
  }>(this.getAll())
  public readonly valueChanges = this.cookieSource.asObservable()
  // tslint:disable-next-line:readonly-keyword
  public mockCookieStore: any = {}

  get(name: string): any {
    return this.mockCookieStore[name]
  }

  getAll() {
    return this.mockCookieStore || {}
  }

  set(
    name: string,
    value: any,
    options?: Cookies.CookieAttributes | undefined
  ): void {
    // tslint:disable-next-line:no-object-mutation
    this.mockCookieStore[name] = value
    this.cookieSource.next(this.getAll())
  }

  remove(name: string, options?: Cookies.CookieAttributes | undefined): void {
    const { [name]: omit, ...newObject } = this.mockCookieStore
    // tslint:disable-next-line:no-object-mutation
    this.mockCookieStore = newObject
    this.cookieSource.next(this.getAll())
  }
}
