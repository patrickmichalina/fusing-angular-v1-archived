import { LogoutComponent } from './logout.component'
import { TransferState } from '@angular/platform-browser'
import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { Component } from '@angular/core'
import { LogoutModule } from './logout.module'
import { AppTestingModule } from '../../../testing/app-testing.module'

@Component({
  selector: 'test-component',
  template: '<pm-logout></pm-logout>'
})
class TestComponent {}

describe(LogoutComponent.name, () => {
  let fixture: ComponentFixture<TestComponent>

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [LogoutModule, AppTestingModule.forRoot()],
        declarations: [TestComponent],
        providers: [TransferState]
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
    'should compile',
    async(() => {
      fixture.detectChanges()
      expect(fixture.componentInstance).toBeDefined()
      expect(fixture).toMatchSnapshot()
    })
  )
})
