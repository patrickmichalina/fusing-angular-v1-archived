import { IPlatformService, PlatformService } from '../platform.service'
import { AdBlockService, IAdBlockService } from './ad-block.service'
import { async, TestBed } from '@angular/core/testing'
import { BaseRequestOptions, Http } from '@angular/http'
import { MockBackend } from '@angular/http/testing'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import { AppTestingModule } from '../../../../../testing/app-testing.module'
// tslint:disable-next-line:import-blacklist
import { of } from 'rxjs'

// tslint:disable:no-object-mutation
// tslint:disable:readonly-keyword
class MockHttp {
  public returnValue: any
  public throw: any

  get(): Observable<any> {
    return Observable.create((observer: Observer<any>) => {
      if (this.throw) observer.error(this.throw)
      observer.next(this.returnValue)
      observer.complete()
    })
  }
}

describe(AdBlockService.name, () => {
  let service: IAdBlockService
  let mockHttp: MockHttp

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [AppTestingModule.forRoot()],
        providers: [
          PlatformService,
          BaseRequestOptions,
          MockBackend,
          {
            provide: Http,
            useValue: new MockHttp()
          },
          AdBlockService
        ]
      })
    })
  )

  beforeEach(() => {
    service = TestBed.get(AdBlockService)
    mockHttp = TestBed.get(Http)
  })

  it(
    'should construct',
    async(() => {
      expect(service).toBeTruthy()
    })
  )

  it(
    'should return an observable when called',
    async(() => {
      expect(service.adBlockerIsActive$).toEqual(expect.any(Observable))
    })
  )

  it(
    'should detect adblock is present',
    async(() => {
      mockHttp.throw = { status: 0 }
      service.adBlockerIsActive$.subscribe(result => expect(result).toBe(true))
    })
  )

  it(
    'should detect adblock is not present',
    async(() => {
      mockHttp.returnValue = { status: 200 }
      service.adBlockerIsActive$.subscribe(result => expect(result).toBe(false))
    })
  )

  it(
    'is not active if server side',
    async(() => {
      TestBed.overrideProvider(PlatformService, {
        useValue: new MockPlatformService(false)
      })
      service.adBlockerIsActive$.subscribe(result => expect(result).toBe(false))
    })
  )
})

class MockPlatformService implements IPlatformService {
  isBrowser: boolean
  isServer: boolean
  constructor(isBrowser: boolean) {
    this.isBrowser = isBrowser
  }
}

export class MockAdBlockService implements IAdBlockService {
  adBlockerIsActive$: Observable<boolean> = of(this.isActive)
  constructor(private isActive = false) {}
}
