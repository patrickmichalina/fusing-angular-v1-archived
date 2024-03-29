import { async, TestBed } from '@angular/core/testing'
import { REQUEST } from '@nguniversal/express-engine/tokens'
import { CookieService } from './cookie.service'

describe(CookieService.name, () => {
  let service: CookieService

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        providers: [CookieService, { provide: REQUEST, useValue: {} }]
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
