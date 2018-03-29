import { AccountSummaryComponent } from './account-summary.component'
import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { Component } from '@angular/core'

describe(AccountSummaryComponent.name, () => {
  let fixture: ComponentFixture<AccountSummaryComponent>

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [AccountSummaryComponent, TestComponent]
      }).compileComponents()
    })
  )

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountSummaryComponent)
  })

  afterEach(() => {
    TestBed.resetTestingModule()
  })

  it(
    'should compile',
    async(() => {
      fixture.detectChanges()
      expect(fixture.nativeElement).toBeDefined()
      expect(fixture.nativeElement).toMatchSnapshot()
    })
  )
})

@Component({
  selector: 'test-component',
  template: '<pm-account-summary></pm-account-summary>'
})
class TestComponent {}
