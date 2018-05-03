import { catchError, distinctUntilChanged, startWith } from 'rxjs/operators'
import { Inject, Injectable, InjectionToken } from '@angular/core'
import { makeStateKey, TransferState } from '@angular/platform-browser'
import { sha1 } from 'object-hash'
import { of } from 'rxjs'
import { AngularFirestore, QueryFn } from 'angularfire2/firestore'

export const FIREBASE_FIRESTORE_TS_PREFIX = new InjectionToken<string>(
  'cfg.fb.fs.prefix'
)

@Injectable()
export class UniversalFirestoreService {
  constructor(
    private ts: TransferState,
    public afs: AngularFirestore,
    @Inject(FIREBASE_FIRESTORE_TS_PREFIX) private prefix: string
  ) {}

  serverCachedDocValueChanges<T>(path: string) {
    const cached = this.ts.get<T | undefined>(this.cacheKey(path), undefined)
    return this.afs
      .doc<T>(path)
      .valueChanges()
      .pipe(
        startWith(cached as T),
        distinctUntilChanged((x, y) => sha1(x) === sha1(y)),
        catchError(err => of(cached))
      )
  }

  serverCachedCollectionValueChanges<T>(path: string, queryFn?: QueryFn) {
    const cached = this.ts.get<ReadonlyArray<T> | undefined>(
      this.cacheKey(path),
      []
    )
    return this.afs
      .collection<T>(path, queryFn)
      .valueChanges()
      .pipe(
        startWith(cached),
        distinctUntilChanged((x, y) => sha1(x) === sha1(y)),
        catchError(err => of(cached))
      )
  }

  cacheKey(path: string) {
    return makeStateKey<string>(`${this.prefix}.${path}`)
  }
}
