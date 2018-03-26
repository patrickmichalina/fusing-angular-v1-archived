import { IUserAgentService, UserAgentService } from './user-agent.service'
import { async, TestBed } from '@angular/core/testing'
import { AppTestingModule } from '../../../../../testing/app-testing.module'

describe(UserAgentService.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule.forRoot()],
      providers: [UserAgentService]
    })
  })

  it(
    'should construct',
    async(() => {
      const service = TestBed.get(UserAgentService) as IUserAgentService
      expect(service).toBeTruthy()
    })
  )
})
