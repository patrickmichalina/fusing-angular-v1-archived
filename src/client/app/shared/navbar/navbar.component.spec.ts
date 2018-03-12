import { RouterTestingModule } from '@angular/router/testing'
import { NavbarComponent } from './navbar.component'
import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { NavbarService } from './navbar.service'
import { Component } from '@angular/core'

describe(NavbarComponent.name, () => {
  let fixture: ComponentFixture<NavbarComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [NavbarComponent, TestComponent],
      providers: [NavbarService]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent)
  })

  afterEach(() => {
    TestBed.resetTestingModule()
  })

  it('should compile', async(() => {
    fixture.detectChanges()
    expect(fixture.nativeElement).toBeDefined()
    expect(fixture.nativeElement).toMatchSnapshot()
  }))
})

@Component({
  selector: 'test-component',
  template: '<pm-navbar></pm-navbar>'
})
class TestComponent {}
