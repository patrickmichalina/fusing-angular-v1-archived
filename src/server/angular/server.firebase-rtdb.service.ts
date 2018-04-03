import { catchError, map, take, tap } from 'rxjs/operators'
import {
  AngularFireDatabase,
  PathReference,
  QueryFn
} from 'angularfire2/database'
import { makeStateKey, TransferState } from '@angular/platform-browser'
// tslint:disable-next-line:import-blacklist
import { of } from 'rxjs'
import { Inject, Injectable } from '@angular/core'
import { FIREBASE_RTDB_TS_PREFIX } from '../../client/app/shared/services/firebase-rtdb.service'
import { QueryParams } from '@firebase/database/dist/esm/src/core/view/QueryParams'
import { HttpClient, HttpParams } from '@angular/common/http'
import { AuthService } from '../../client/app/shared/services/auth.service'

@Injectable()
export class ServerUniversalRtDbService {
  constructor(
    public angularFireDatabase: AngularFireDatabase,
    private ts: TransferState,
    private http: HttpClient,
    private auth: AuthService,
    @Inject(FIREBASE_RTDB_TS_PREFIX) private prefix: string
  ) {}

  serverCachedObjectValueChanges<T>(path: string) {
    return this.angularFireDatabase
      .object<T>(path)
      .valueChanges()
      .pipe(
        tap(value => this.cache(path, value)),
        take(1),
        catchError(err => of(undefined))
      )
  }

  serverCachedListValueChanges<T>(path: PathReference, queryFn?: QueryFn) {
    const query =
      (queryFn &&
        queryFn(this.angularFireDatabase.database.ref(path.toString()))) ||
      this.angularFireDatabase.database.ref(path.toString())
    const internalQueryParams = (query as any).queryParams_ as QueryParams
    const paramsFromString = internalQueryParams.toRestQueryStringParameters()
    const url = query.toString()
    return this.http
      .get(`${url}.json`, {
        params: new HttpParams({
          fromObject: {
            ...paramsFromString,
            auth: this.auth.getCustomFirebaseToken() || ''
          }
        })
      })
      .pipe(
        map((val: { readonly [key: string]: any }) =>
          Object.keys(val).map(key => val[key] as T)
        ),
        tap(value => this.cache(path.toString(), value)),
        catchError(err => {
          // TODO
          return of([])
        })
      )
  }

  private cacheKey(path: string) {
    return makeStateKey<string>(`${this.prefix}.${path}`)
  }

  private cache(path: string, value: any) {
    this.ts.set(this.cacheKey(path), value)
  }
}
