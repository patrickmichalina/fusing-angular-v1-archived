import { SEOService } from './shared/services/seo.service'
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  ViewChild
} from '@angular/core'
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga'
import { RouteDataService } from './shared/services/route-data.service'
import { NavbarComponent } from './shared/navbar/navbar.component'
import { DOCUMENT } from '@angular/common'
import { MatSidenav } from '@angular/material'
import { NavigationEnd, Router } from '@angular/router'
import { filter } from 'rxjs/operators'
import { AuthService } from './shared/services/auth.service'
// tslint:disable-next-line:import-blacklist
import { combineLatest } from 'rxjs'

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

  readonly routesChanges = this.router.events.pipe(
    filter(event => event instanceof NavigationEnd)
  )

  constructor(
    @Inject(DOCUMENT) private doc: HTMLDocument,
    private router: Router,
    private auth: AuthService,
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

  get routeWrapperElement(): HTMLElement | null {
    return this.doc.getElementById('route-wrapper')
  }

  applyNavShadowListener() {
    this.routeWrapperElement &&
      this.routeWrapperElement.addEventListener('scroll', e => {
        const scroll = (e.target as HTMLDivElement).scrollTop
        if (scroll === 0) {
          this.navbarElement &&
            this.navbarElement.classList.remove('mat-elevation-z6')
        } else {
          this.navbarElement &&
            this.navbarElement.classList.add('mat-elevation-z6')
        }
      })
  }

  ngAfterViewInit() {
    this.applyNavShadowListener()
    this.routesChanges.subscribe(() => {
      this.sidenav && this.sidenav.close()
    })
  }

  login() {
    this.auth.login()
  }

  logout() {
    this.auth.logout()
  }

  readonly view$ = combineLatest(this.auth.user$, user => {
    return {
      loggedIn: user ? 1 : 0
    }
  })
}
