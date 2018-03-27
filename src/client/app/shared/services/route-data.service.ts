import { Injectable } from '@angular/core'
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { filter, flatMap, map, shareReplay } from 'rxjs/operators'
import { Observable } from 'rxjs/Observable'

export interface IRouteDataService {
  readonly data: Observable<{
    readonly data: { readonly [key: string]: any }
    readonly componentName?: string
  }>
  pluck<T>(key: string): Observable<T | undefined>
  meta(): Observable<RouteMeta | undefined>
}

export interface RouteMeta {
  readonly title?: string
  readonly description?: string
}

// tslint:disable:no-parameter-reassignment
const extractFirstChild = (route: ActivatedRoute) => {
  while (route.firstChild) route = route.firstChild
  return route
}

@Injectable()
export class RouteDataService implements IRouteDataService {
  constructor(private router: Router, private ar: ActivatedRoute) {}

  readonly data = this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    map(() => this.ar),
    map(extractFirstChild),
    flatMap(route =>
      route.data.pipe(
        map(data => {
          return {
            data,
            componentName: route.component && (route.component as any).name
          }
        })
      )
    ),
    shareReplay(1)
  )

  pluck<T>(key: string) {
    return this.data.pipe(map(a => a.data[key] as T | undefined))
  }

  meta() {
    return this.pluck<RouteMeta>('meta').pipe(filter<RouteMeta>(Boolean))
  }
}
