import { PlatformService } from './platform.service'
import {
  catchError,
  distinctUntilChanged,
  startWith,
  tap
} from 'rxjs/operators'
import { Inject, Injectable, InjectionToken } from '@angular/core'
import { makeStateKey, TransferState } from '@angular/platform-browser'
import { sha1 } from 'object-hash'
// tslint:disable-next-line:import-blacklist
import { of } from 'rxjs'
import { AngularFirestore, QueryFn } from 'angularfire2/firestore'

export const FIREBASE_FIRESTORE_TS_PREFIX = new InjectionToken<string>(
  'cfg.fb.fs.prefix'
)

@Injectable()
export class UniversalFirestoreService {
  constructor(
    private ts: TransferState,
    private ps: PlatformService,
    public afs: AngularFirestore,
    @Inject(FIREBASE_FIRESTORE_TS_PREFIX) private prefix: string
  ) {}

  serverCachedDocValueChanges<T>(path: string) {
    const cached = this.ts.get<T | undefined>(this.cacheKey(path), undefined)
    return (cached
      ? this.afs
          .doc<T>(path)
          .valueChanges()
          .pipe(
            startWith(cached),
            tap(a => this.ts.remove(this.cacheKey(path))),
            catchError(err => of(cached))
          )
      : this.afs
          .doc<T>(path)
          .valueChanges()
          .pipe(
            tap(value => this.cache(path, value)),
            catchError(err => of(cached))
          )
    ).pipe(distinctUntilChanged((x, y) => sha1(x) !== sha1(y)))
  }

  serverCachedCollectionValueChanges<T>(path: string, queryFn?: QueryFn) {
    const cached = this.ts.get<ReadonlyArray<T> | undefined>(
      this.cacheKey(path.toString()),
      undefined
    )
    return (cached
      ? this.afs
          .collection<T>(path)
          .valueChanges()
          .pipe(
            startWith(cached as any),
            tap(a => this.ts.remove(this.cacheKey(path))),
            catchError(err => of(cached))
          )
      : this.afs
          .collection<T>(path)
          .valueChanges()
          .pipe(
            tap(value => this.cache(path.toString(), value)),
            catchError(err => of([]))
          )
    ).pipe(distinctUntilChanged((x, y) => sha1(x) === sha1(y)))
  }

  cacheKey(path: string) {
    return makeStateKey<string>(`${this.prefix}.${path}`)
  }

  cache(path: string, value: any) {
    this.ps.isServer && this.ts.set(this.cacheKey(path), value)
  }
}
