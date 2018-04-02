import { PlatformService } from './platform.service'
import {
  catchError,
  distinctUntilChanged,
  startWith,
  tap
} from 'rxjs/operators'
import { Inject, Injectable, InjectionToken } from '@angular/core'
import { AngularFireDatabase, PathReference } from 'angularfire2/database'
import { makeStateKey, TransferState } from '@angular/platform-browser'
import { sha1 } from 'object-hash'
// tslint:disable-next-line:import-blacklist
import { of } from 'rxjs'
import { Query, Reference } from '@firebase/database-types'

export const FIREBASE_RTDB_TS_PREFIX = new InjectionToken<string>(
  'cfg.fb.rtdb.prefix'
)

@Injectable()
export class UniversalRtDbService {
  constructor(
    public angularFireDatabase: AngularFireDatabase,
    private ts: TransferState,
    private ps: PlatformService,
    @Inject(FIREBASE_RTDB_TS_PREFIX) private prefix: string
  ) {}

  serverCachedObjectValueChanges<T>(path: string) {
    const cached = this.ts.get<T | undefined>(this.cacheKey(path), undefined)
    return (cached
      ? this.angularFireDatabase
          .object<T>(path)
          .valueChanges()
          .pipe(startWith(cached), catchError(err => of(cached)))
      : this.angularFireDatabase
          .object<T>(path)
          .valueChanges()
          .pipe(
            tap(value => this.cache(path, value)),
            catchError(err => of(cached))
          )
    ).pipe(distinctUntilChanged((x, y) => sha1(x) !== sha1(y)))
  }

  serverCachedListValueChanges<T>(
    path: PathReference,
    queryFn?: (ref: Reference) => Query
  ) {
    const cached = this.ts.get<ReadonlyArray<T>>(
      this.cacheKey(path.toString()),
      []
    )
    return (cached.length > 0
      ? this.angularFireDatabase
          .list<T>(path)
          .valueChanges()
          .pipe(startWith(cached as any), catchError(err => of(cached)))
      : this.angularFireDatabase
          .list<T>(path)
          .valueChanges()
          .pipe(
            tap(value => this.cache(path.toString(), value)),
            catchError(err => of(cached))
          )
    ).pipe(distinctUntilChanged((x, y) => sha1(x) === sha1(y)))
  }

  private cacheKey(path: string) {
    return makeStateKey<string>(`${this.prefix}.${path}`)
  }

  private cache(path: string, value: any) {
    this.ps.isServer && this.ts.set(this.cacheKey(path), value)
  }
}
