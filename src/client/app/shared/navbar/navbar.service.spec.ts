import { async, TestBed } from '@angular/core/testing'
import { INavbarService, NavbarService } from './navbar.service'
import { Observable } from 'rxjs/Observable'
import { AppTestingModule } from '../../../../testing/app-testing.module'

describe(NavbarService.name, () => {
  let service: INavbarService

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [AppTestingModule.forRoot()],
        providers: [NavbarService]
      })
    })
  )

  beforeEach(() => {
    service = TestBed.get(NavbarService)
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

  it(
    'should return an observable when called',
    async(() => {
      expect(service.menu$).toEqual(expect.any(Observable))
    })
  )
})
