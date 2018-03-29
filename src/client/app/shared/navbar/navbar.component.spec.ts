import { RouterTestingModule } from '@angular/router/testing'
import { NavbarComponent } from './navbar.component'
import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { NavbarService } from './navbar.service'
import { Component } from '@angular/core'
import { AuthService } from '../services/auth.service'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { of } from 'rxjs/observable/of'
import { MaterialModule } from '../material.module'
import { AccountSummaryComponent } from '../account-summary/account-summary.component'

describe(NavbarComponent.name, () => {
  let fixture: ComponentFixture<NavbarComponent>

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, RouterTestingModule, MaterialModule],
        declarations: [NavbarComponent, TestComponent, AccountSummaryComponent],
        providers: [
          NavbarService,
          AuthService,
          {
            provide: AuthService,
            useValue: {
              user$: of({})
            }
          }
        ]
      }).compileComponents()
    })
  )

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent)
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
  template: '<pm-navbar></pm-navbar>'
})
class TestComponent {}
