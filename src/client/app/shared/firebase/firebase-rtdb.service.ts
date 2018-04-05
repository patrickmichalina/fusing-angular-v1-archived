import {
  catchError,
  distinctUntilChanged,
  startWith,
  tap
} from 'rxjs/operators'
import {
  ApplicationRef,
  Inject,
  Injectable,
  InjectionToken
} from '@angular/core'
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
  // tslint:disable-next-line:readonly-keyword
  readFromCache = true
  constructor(
    public angularFireDatabase: AngularFireDatabase,
    private ts: TransferState,
    appRef: ApplicationRef,
    @Inject(FIREBASE_RTDB_TS_PREFIX) private prefix: string
  ) {
    // tslint:disable-next-line:no-object-mutation
    // appRef.isStable.pipe(filter(Boolean), take(1)).subscribe(() => this.readFromCache = false)
  }

  private turnOffCache() {
    // tslint:disable-next-line:no-object-mutation
    this.readFromCache = false
  }

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
    const cached =
      (this.readFromCache &&
        this.ts.get<T | undefined>(this.cacheKey(path), undefined)) ||
      undefined

    return cached
      ? obs.pipe(cachedPiper(cached), tap(() => this.turnOffCache()))
      : obs.pipe(piper(failureReturn))
  }

  private cacheKey(path: string) {
    return makeStateKey<string>(`${this.prefix}.${path}`)
  }
}
