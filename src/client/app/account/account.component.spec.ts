import { AccountComponent } from './account.component'
import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { Component } from '@angular/core'
import { AccountModule } from './account.module'
import { AppTestingModule } from '../../../testing/app-testing.module'

@Component({
  selector: 'test-component',
  template: '<pm-account></pm-account>'
})
class TestComponent {}

describe(AccountComponent.name, () => {
  let fixture: ComponentFixture<TestComponent>

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [AccountModule, AppTestingModule.forRoot()],
        declarations: [TestComponent]
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
