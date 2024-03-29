import { PlatformService } from './platform.service'
import { CookieService } from './cookie.service'
import { async, TestBed } from '@angular/core/testing'
import { REQUEST } from '@nguniversal/express-engine/tokens'

describe(CookieService.name, () => {
  let service: CookieService

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        providers: [
          CookieService,
          PlatformService,
          { provide: REQUEST, useValue: {} }
        ]
      })
    })
  )

  beforeEach(() => {
    service = TestBed.get(CookieService)
  })

  afterEach(() => {
    TestBed.resetTestingModule()
  })

  it(
    'should construct',
    async(() => {
      expect(service).toBeDefined()
    })
  )
})
