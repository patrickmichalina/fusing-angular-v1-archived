import { NotFoundComponent } from './not-found.component'
import { TransferState } from '@angular/platform-browser'
import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { Component } from '@angular/core'
import { NotFoundModule } from './not-found.module'
import { AppTestingModule } from '../../../testing/app-testing.module'
import { ResponseService } from '../shared/services/response.service'

@Component({
  selector: 'test-component',
  template: '<pm-not-found></pm-not-found>'
})
class TestComponent {}

describe(NotFoundComponent.name, () => {
  let fixture: ComponentFixture<TestComponent>

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [NotFoundModule, AppTestingModule.forRoot()],
        declarations: [TestComponent],
        providers: [ResponseService, TransferState]
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
