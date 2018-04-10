import { MatSidenav } from '@angular/material'
import { DOCUMENT } from '@angular/common'
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga'
import { RouteDataService } from './shared/services/route-data.service'
import { NavbarComponent } from './shared/navbar/navbar.component'
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  Renderer2,
  ViewChild
} from '@angular/core'
import { SEOService } from './shared/services/seo.service'
import { NavigationEnd, Router } from '@angular/router'
import { filter, startWith } from 'rxjs/operators'
import { AuthService } from './shared/services/auth.service'
// tslint:disable-next-line:import-blacklist
import { combineLatest, Subject } from 'rxjs'
import { WindowService } from './shared/services/utlities/window.service'
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { EnvironmentService } from './shared/services/environment.service'

const SHADOW_CLASS = 'mat-elevation-z6'

@Component({
  selector: 'pm-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements AfterViewInit {
  @ViewChild(MatSidenav) readonly sidenav: MatSidenav | undefined
  @ViewChild(NavbarComponent, { read: ElementRef })
  readonly navbarRef: ElementRef | undefined

  readonly sideToggleSource = new Subject<boolean>()
  readonly sideToggled$ = this.sideToggleSource.pipe(startWith(false))

  readonly routesChanges = this.router.events.pipe(
    filter(event => event instanceof NavigationEnd)
  )

  private readonly isHandset$ = this.brkpt.observe([
    Breakpoints.HandsetLandscape,
    Breakpoints.HandsetPortrait
  ])

  constructor(
    @Inject(DOCUMENT) private doc: HTMLDocument,
    private router: Router,
    private auth: AuthService,
    private ws: WindowService,
    private brkpt: BreakpointObserver,
    private rdr: Renderer2,
    private es: EnvironmentService,
    analytics: Angulartics2GoogleAnalytics,
    seo: SEOService,
    rds: RouteDataService
  ) {
    rds.meta().subscribe(meta => {
      seo.setTitle(meta.title)
      seo.setDescription(meta.description)
    })
  }

  get navbarElement(): HTMLElement | undefined {
    return this.navbarRef && this.navbarRef.nativeElement
  }

  applyNavShadowListener() {
    if (!this.navbarElement) return
    this.doc.addEventListener('scroll', e => {
      this.ws.window().scrollY <= 0
        ? this.rdr.removeClass(this.navbarElement, SHADOW_CLASS)
        : this.rdr.addClass(this.navbarElement, SHADOW_CLASS)
    })
  }

  ngAfterViewInit() {
    this.applyNavShadowListener()
    this.routesChanges.subscribe(() => this.closeNav())
  }

  closeNav() {
    this.sidenav && this.sidenav.mode !== 'side' && this.sidenav.close()
  }

  toggle() {
    if (!this.sidenav) return
    this.sidenav.toggle()
    this.sideToggleSource.next(this.sidenav.opened)
  }

  login() {
    this.auth.login()
  }

  logout() {
    this.auth.logout()
  }

  readonly view$ = combineLatest(
    this.auth.user$,
    this.isHandset$,
    this.sideToggled$,
    (user, isHandset, toggled) => {
      return {
        loggedIn: user ? 1 : 0,
        mode: isHandset.matches ? 'over' : 'side',
        opened: !isHandset.matches && toggled,
        appName: this.es.config.appName
      }
    }
  )
}
