import {
  catchError,
  distinctUntilChanged,
  startWith,
  tap
} from 'rxjs/operators'
import { Inject, Injectable, InjectionToken } from '@angular/core'
import { AngularFireDatabase } from 'angularfire2/database'
import { makeStateKey, TransferState } from '@angular/platform-browser'
import { sha1 } from 'object-hash'
// tslint:disable-next-line:import-blacklist
import { Observable, of } from 'rxjs'
import { Query, Reference } from '@firebase/database-types'

export const FIREBASE_RTDB_TS_PREFIX = new InjectionToken<string>(
  'cfg.fb.rtdb.prefix'
)

const piper = (failureReturn?: any) => <T>(source: Observable<T>) =>
  source.pipe(
    distinctUntilChanged((x, y) => sha1(x) === sha1(y)),
    catchError(err => of(failureReturn))
  )
const cachedPiper = <T>(cached: T) => (source: Observable<T>) =>
  source.pipe(startWith(cached), piper())

@Injectable()
export class UniversalRtDbService {
  constructor(
    public angularFireDatabase: AngularFireDatabase,
    private ts: TransferState,
    @Inject(FIREBASE_RTDB_TS_PREFIX) private prefix: string
  ) {}

  serverCachedObjectValueChanges<T>(path: string) {
    const base = this.angularFireDatabase.object<T>(path).valueChanges()
    return this.valueChangesGen<T | null>(path, base)
  }

  serverCachedListValueChanges<T>(
    path: string,
    queryFn?: (ref: Reference) => Query
  ) {
    const base = this.angularFireDatabase.list<T>(path, queryFn).valueChanges()
    return this.valueChangesGen<ReadonlyArray<T>>(path, base, [])
  }

  private valueChangesGen<T>(
    path: string,
    obs: Observable<T>,
    failureReturn?: any
  ) {
    const cached = this.ts.get<T | undefined>(this.cacheKey(path), undefined)

    return cached
      ? obs.pipe(
          cachedPiper(cached),
          tap(() => this.ts.remove(this.cacheKey(path)))
        )
      : obs.pipe(piper(failureReturn))
  }

  private cacheKey(path: string) {
    return makeStateKey<string>(`${this.prefix}.${path}`)
  }
}
