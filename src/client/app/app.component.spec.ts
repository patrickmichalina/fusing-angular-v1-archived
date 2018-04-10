import { SharedModule } from './shared/shared.module'
import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { APP_BASE_HREF } from '@angular/common'
import { Route } from '@angular/router'
import { RouterTestingModule } from '@angular/router/testing'
import { Component } from '@angular/core'
import { HomeComponent } from './home/home.component'
import { AppModule } from './app.module'
import { AppBrowserModule } from './app.browser.module'
import { EnvConfig } from '../../../tools/config/app.config'
import { ENV_CONFIG } from './app.config'
import { EnvironmentService } from './shared/services/environment.service'
import { Angulartics2Module } from 'angulartics2'
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { NavbarService } from './shared/navbar/navbar.service'
import { AppTestingModule } from '../../testing/app-testing.module'

export const TESTING_CONFIG: EnvConfig = {
  siteUrl: 'http://localhost:5000',
  appName: 'fusing-angular',
  // tslint:disable-next-line:max-line-length
  endpoints: {
    api: 'http://localhost:5000/api',
    websocketServer: 'ws://localhost:5001'
  }
}

@Component({
  selector: 'test-cmp',
  template: '<pm-app></pm-app>'
})
class TestComponent {}

describe('App component', () => {
  const config: ReadonlyArray<Route> = [{ path: '', component: HomeComponent }]

  let fixture: ComponentFixture<TestComponent>

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          AppModule,
          AppTestingModule.forRoot(),
          AppBrowserModule,
          SharedModule,
          HttpClientTestingModule,
          RouterTestingModule.withRoutes(config as any),
          Angulartics2Module.forRoot([Angulartics2GoogleAnalytics])
        ],
        declarations: [TestComponent, HomeComponent],
        providers: [
          { provide: APP_BASE_HREF, useValue: '/' },
          { provide: ENV_CONFIG, useValue: TESTING_CONFIG },
          EnvironmentService,
          NavbarService
        ]
      }).compileComponents()
    })
  )

  beforeEach(
    async(() => {
      fixture = TestBed.createComponent(TestComponent)
    })
  )

  afterEach(
    async(() => {
      TestBed.resetTestingModule()
    })
  )

  it(
    'should build without a problem',
    async(() => {
      expect(fixture.nativeElement).toBeTruthy()
      expect(fixture.nativeElement).toMatchSnapshot()
    })
  )
})
