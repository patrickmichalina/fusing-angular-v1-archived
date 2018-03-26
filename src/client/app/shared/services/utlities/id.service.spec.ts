import { async, TestBed } from '@angular/core/testing'
import { AppTestingModule } from '../../../../../testing/app-testing.module'
import { IdService } from './id.service'

describe(IdService.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule.forRoot()],
      providers: [IdService]
    })
  })

  it(
    'should construct',
    async(() => {
      const service = TestBed.get(IdService)
      expect(service).toBeTruthy()
    })
  )
})
