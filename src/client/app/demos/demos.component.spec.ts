import { DemosComponent } from './demos.component'
import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { Component } from '@angular/core'
import { DemosModule } from './demos.module'
import { AppTestingModule } from '../../../testing/app-testing.module'

@Component({
  selector: 'test-component',
  template: '<pm-demos></pm-demos>'
})
class TestComponent {}

describe(DemosComponent.name, () => {
  let fixture: ComponentFixture<TestComponent>

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [AppTestingModule.forRoot(), DemosModule],
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
      expect(fixture.nativeElement).toBeDefined()
      expect(fixture).toMatchSnapshot()
    })
  )
})
