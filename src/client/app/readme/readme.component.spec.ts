import { ReadmeComponent } from './readme.component'
import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { Component } from '@angular/core'
import { ReadmeModule } from './Readme.module'
import { AppTestingModule } from '../../../testing/app-testing.module'

@Component({
  selector: 'test-component',
  template: '<pm-readme></pm-readme>'
})
class TestComponent {}

describe(ReadmeComponent.name, () => {
  let fixture: ComponentFixture<ReadmeComponent>

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [AppTestingModule.forRoot(), ReadmeModule],
        declarations: [TestComponent]
      }).compileComponents()
    })
  )

  beforeEach(
    async(() => {
      fixture = TestBed.createComponent(ReadmeComponent)
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
      expect(fixture.nativeElement).toBeDefined()
      expect(fixture).toMatchSnapshot()
    })
  )
})
