import { catchError, map, take, tap } from 'rxjs/operators'
import { PathReference, QueryFn } from 'angularfire2/database'
import { makeStateKey, TransferState } from '@angular/platform-browser'
// tslint:disable-next-line:import-blacklist
import { of } from 'rxjs'
import { Inject, Injectable, NgZone } from '@angular/core'
import { FIREBASE_RTDB_TS_PREFIX } from '../../../client/app/shared/firebase/firebase-rtdb.service'
import { QueryParams } from '@firebase/database/dist/esm/src/core/view/QueryParams'
import { HttpClient, HttpParams } from '@angular/common/http'
import { database } from 'firebase-admin'
import { FIREBASE_USER_AUTH_TOKEN } from './firebase-server.module'

@Injectable()
export class ServerUniversalRtDbService {
  constructor(
    private ts: TransferState,
    private http: HttpClient,
    private zone: NgZone,
    @Inject(FIREBASE_RTDB_TS_PREFIX) private prefix: string,
    @Inject(FIREBASE_USER_AUTH_TOKEN) private authToken: string
  ) {}

  serverCachedObjectValueChanges<T>(path: string) {
    return this.zone.runOutsideAngular(() => {
      const query = database().ref(path)
      const url = query.toString()
      return this.http
        .get<T>(`${url}.json`, {
          params: new HttpParams({
            fromObject: {
              auth: this.authToken
            }
          })
        })
        .pipe(
          take(1),
          tap(value => this.cache(path.toString(), value)),
          catchError(err => {
            return of(undefined) // TODO
          })
        )
    })
  }

  serverCachedListValueChanges<T>(path: PathReference, queryFn?: QueryFn) {
    return this.zone.runOutsideAngular(() => {
      const query =
        (queryFn && queryFn(database().ref(path.toString()))) ||
        database().ref(path.toString())
      const internalQueryParams = (query as any).queryParams_ as QueryParams
      const paramsFromString = internalQueryParams.toRestQueryStringParameters()
      const url = query.toString()
      return this.http
        .get(`${url}.json`, {
          params: new HttpParams({
            fromObject: {
              ...paramsFromString,
              auth: this.authToken
            }
          })
        })
        .pipe(
          take(1),
          map((val: { readonly [key: string]: any }) =>
            Object.keys(val).map(key => val[key] as T)
          ),
          tap(value => this.cache(path.toString(), value)),
          catchError(err => {
            return of([]) // TODO
          })
        )
    })
  }

  private cacheKey(path: string) {
    return makeStateKey<string>(`${this.prefix}.${path}`)
  }

  private cache(path: string, value: any) {
    this.ts.set(this.cacheKey(path), value)
  }
}
