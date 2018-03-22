import { REQUEST } from '@nguniversal/express-engine/tokens'
import { IPlatformService, PlatformService } from '../platform.service'
import { ENV_CONFIG } from './../../../app.config'
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http'
import { HttpTestingController } from '@angular/common/http/testing'
import { async, TestBed } from '@angular/core/testing'
import { AppTestingModule } from '../../../../../testing/app-testing.module'
import { AuthService } from '../auth.service'
import { LoggingService } from '../logging.service'
import {
  COOKIE_HOST_WHITELIST,
  HttpAuthInterceptor
} from './http-authorization-interceptor.service'

describe(HttpAuthInterceptor.name, () => {
  describe('when on platform server', () => {
    let interceptor: HttpInterceptor
    let http: HttpClient
    let httpMock: HttpTestingController

    beforeEach(
      async(() => {
        TestBed.configureTestingModule({
          imports: [AppTestingModule.forRoot()],
          providers: [
            HttpAuthInterceptor,
            LoggingService,
            {
              provide: HTTP_INTERCEPTORS,
              useClass: HttpAuthInterceptor,
              multi: true
            },
            {
              provide: COOKIE_HOST_WHITELIST,
              useValue: ['http://cloud9.tv']
            },
            {
              provide: PlatformService,
              useValue: new MockPlatformService(false)
            },
            {
              provide: REQUEST,
              useValue: {
                cookies: {
                  'id-token': '123'
                }
              }
            }
          ]
        })
      })
    )

    beforeEach(() => {
      interceptor = TestBed.get(HttpAuthInterceptor)
      http = TestBed.get(HttpClient)
      httpMock = TestBed.get(HttpTestingController)
    })

    afterEach(() => {
      TestBed.resetTestingModule()
    })

    it(
      'should construct',
      async(() => {
        expect(interceptor).toBeDefined()
      })
    )

    // it(
    //   'should set server cookies when user is logged in',
    //   async(() => {
    //     expect.assertions(4)

    //     http
    //       .get('http://cloud9.tv/articles/123', {
    //         observe: 'response'
    //       })
    //       .subscribe(response => {
    //         expect(response).toBeInstanceOf(HttpResponse)
    //       })

    //     const req = httpMock.expectOne(
    //       r => r.url === 'http://cloud9.tv/articles/123'
    //     )
    //     expect(req.request.method).toEqual('GET')
    //     expect(req.request.withCredentials).toBeTruthy()
    //     expect(req.request.headers.get('Cookie')).toEqual('id-token=123;')

    //     req.flush({})
    //     httpMock.verify()
    //   })
    // )

    it(
      'should return original request if no auth data is found',
      async(() => {
        expect.assertions(3)

        http
          .get('http://cloud9.tv/articles/123', {
            observe: 'response'
          })
          .subscribe(response => {
            expect(response).toBeInstanceOf(HttpResponse)
          })

        const req = httpMock.expectOne(
          r => r.url === 'http://cloud9.tv/articles/123'
        )
        expect(req.request.method).toEqual('GET')
        expect(req.request.headers.get('Authorization')).toBeFalsy()

        req.flush({})
        httpMock.verify()
      })
    )
  })
  describe('when on platform browser', () => {
    let interceptor: HttpInterceptor
    let http: HttpClient
    let httpMock: HttpTestingController
    let authService: AuthService

    beforeEach(
      async(() => {
        TestBed.configureTestingModule({
          imports: [AppTestingModule.forRoot()],
          providers: [
            HttpAuthInterceptor,
            LoggingService,
            {
              provide: HTTP_INTERCEPTORS,
              useClass: HttpAuthInterceptor,
              multi: true
            },
            {
              provide: PlatformService,
              useValue: new MockPlatformService(true)
            },
            { provide: REQUEST, useValue: {} },
            {
              provide: ENV_CONFIG,
              useValue: {
                endpoints: {
                  discovery: 'http://some.endpoint/api'
                }
              }
            }
          ]
        })
      })
    )

    beforeEach(() => {
      interceptor = TestBed.get(HttpAuthInterceptor)
      http = TestBed.get(HttpClient)
      httpMock = TestBed.get(HttpTestingController)
      authService = TestBed.get(AuthService)
    })

    afterEach(() => {
      TestBed.resetTestingModule()
    })

    it(
      'should construct',
      async(() => {
        expect(interceptor).toBeDefined()
      })
    )

    it(
      'should clone request with credentials set to true',
      async(() => {
        expect.assertions(2)
        http
          .get('http://cloud9.tv/articles/123', {
            observe: 'response'
          })
          .subscribe(response => {
            expect(response).toBeInstanceOf(HttpResponse)
          })

        const req = httpMock.expectOne(
          r => r.url === 'http://cloud9.tv/articles/123'
        )
        expect(req.request.method).toEqual('GET')
        // TODO: expect(req.request.withCredentials).toBeTruthy()
        req.flush({ data: {} })
        httpMock.verify()
      })
    )

    it(
      'should not inject auth headers on a POST request when jwt_token is not available',
      async(() => {
        expect.assertions(2)
        spyOn(authService, 'getValidToken').and.returnValue(undefined)

        const body = { data: {} }
        http
          .post('http://cloud9.tv/articles/123', {
            observe: 'response'
          })
          .subscribe(response => {
            expect(response).toBe(body)
          })

        const req = httpMock.expectOne(
          r => r.headers.get('Authorization') === null
        )
        expect(req.request.method).toEqual('POST')

        req.flush(body)
        httpMock.verify()
      })
    )
  })
})

class MockPlatformService implements IPlatformService {
  readonly isServer = !this.isBrowser
  constructor(public isBrowser = true) {}
}
