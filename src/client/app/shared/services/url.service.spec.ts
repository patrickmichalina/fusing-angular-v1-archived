import { IUrlService, UrlService } from './url.service'
import { async, TestBed } from '@angular/core/testing'
import { LoggingService } from './logging.service'
import { AppTestingModule } from '../../../../testing/app-testing.module'

describe(UrlService.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule.forRoot()],
      providers: [UrlService, LoggingService]
    })
  })

  it(
    'should construct',
    async(() => {
      const service = TestBed.get(UrlService) as IUrlService
      expect(service).toBeTruthy()
    })
  )

  it(
    'should parse out base domain',
    async(() => {
      const service = TestBed.get(UrlService) as IUrlService
      expect(service.parseBaseDomain('http://api.cloud9.com')).toEqual(
        'cloud9.com'
      )
      expect(service.parseBaseDomain('https://api.cloud9.com')).toEqual(
        'cloud9.com'
      )
    })
  )

  it(
    'should parse out base domain with missing protocal',
    async(() => {
      const service = TestBed.get(UrlService) as IUrlService
      expect(service.parseBaseDomain('api.cloud9.com')).toEqual('cloud9.com')
    })
  )

  it(
    'should parse out a hostname with no TLD',
    async(() => {
      const service = TestBed.get(UrlService) as IUrlService
      expect(service.parseRootDomain('http://api.cloud9.com')).toEqual('cloud9')
      expect(service.parseRootDomain('https://api.cloud9.com')).toEqual(
        'cloud9'
      )
    })
  )

  it(
    'should NOT parse out site code "cloud9" when on localhost',
    async(() => {
      const service = TestBed.get(UrlService) as IUrlService
      expect(service.parseRootDomain('http://localhos')).not.toEqual('cloud9')
      expect(service.parseRootDomain('http://localhos:8000')).not.toEqual(
        'cloud9'
      )
    })
  )

  it(
    'should parse out a hostname with no TLD provided with a missing protocal',
    async(() => {
      const service = TestBed.get(UrlService) as IUrlService
      expect(service.parseRootDomain('api.cloud9.com')).toEqual('cloud9')
    })
  )

  it(
    'should decode URL',
    async(() => {
      const service = TestBed.get(UrlService) as IUrlService
      const testUrl =
        'https://developer.mozilla.org/ru/docs/JavaScript_%D1%88%D0%B5%D0%BB%D0%BB%D1%8B'
      expect(service.decode(testUrl)).toEqual(
        'https://developer.mozilla.org/ru/docs/JavaScript_шеллы'
      )
    })
  )

  it(
    'should return undefined when decoding malformed URL',
    async(() => {
      const service = TestBed.get(UrlService) as IUrlService
      const testUrl = '%E0%A4%A'
      expect(service.decode(testUrl)).toBeUndefined()
    })
  )
})
