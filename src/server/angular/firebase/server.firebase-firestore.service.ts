import { FIREBASE_FIRESTORE_TS_PREFIX } from '../../../client/app/shared/firebase/firebase-firestore.service'
import {
  catchError,
  distinctUntilChanged,
  flatMap,
  startWith,
  take,
  tap
} from 'rxjs/operators'
import { makeStateKey, TransferState } from '@angular/platform-browser'
import { sha1 } from 'object-hash'
// tslint:disable-next-line:import-blacklist
import { of } from 'rxjs'
import { Inject, Injectable, NgZone } from '@angular/core'
import { AuthService } from '../../../client/app/shared/services/auth.service'
import { fromPromise } from 'rxjs/observable/fromPromise'
import { AngularFirestore, QueryFn } from 'angularfire2/firestore'

@Injectable()
export class ServerUniversalFirestoreService {
  constructor(
    private ts: TransferState,
    public afs: AngularFirestore,
    private auth: AuthService,
    private zone: NgZone,
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

  // serverCachedCollectionValueChanges<T>(path: string, queryFn?: QueryFn) {
  //   const cached = this.ts.get<ReadonlyArray<T> | undefined>(
  //     this.cacheKey(path.toString()),
  //     undefined
  //   )
  //   return (cached
  //     ? this.afs
  //         .collection<T>(path)
  //         .valueChanges()
  //         .pipe(
  //           startWith(cached as any),
  //           tap(a => this.ts.remove(this.cacheKey(path))),
  //           catchError(err => of(cached))
  //         )
  //     : this.afs
  //         .collection<T>(path)
  //         .valueChanges()
  //         .pipe(
  //           tap(value => this.cache(path.toString(), value)),
  //           catchError(err => of([]))
  //         )
  //   ).pipe(distinctUntilChanged((x, y) => sha1(x) === sha1(y)))
  // }

  serverCachedCollectionValueChanges<T>(path: string, queryFn?: QueryFn) {
    const query =
      (queryFn && queryFn(this.afs.firestore.collection(path))) ||
      this.afs.firestore.collection(path)
    // this.afs.firestore
    // this.at.auth
    return this.zone.runOutsideAngular<any>(() => {
      return this.auth.user$.pipe(
        // flatMap(user => {
        //   return fbAuth()
        //     .createCustomToken(user && user.sub)
        //     .then(customToken => this.at.auth.signInWithCustomToken(customToken))
        // }),
        flatMap(() =>
          fromPromise(query.get().then(b => b.docs.map(c => c.data() as T)))
        ),
        take(1),
        // map((b: QuerySnapshot) => b.docs.map(c => c.data() as T)),
        tap(value => this.cache(path, value))
      )
      // console.log(this.afs.firestore.collection(path).firestore)
      // return of([])

      // return fromPromise(this.test()).pipe(map(a => []))

      // const roles = (user && user[process.env.AUTH0_ROLES_KEY as string]) || {}

      // return of([])
      // const internalQueryParams = (query as any).queryParams_ as QueryParams
      // const paramsFromString = internalQueryParams.toRestQueryStringParameters()
      // const url = query.toString()
      // return this.http
      //   .get(`${url}.json`, {
      //     params: new HttpParams({
      //       fromObject: {
      //         ...paramsFromString,
      //         auth: this.auth.getCustomFirebaseToken() || ''
      //       }
      //     })
      //   })
      //   .pipe(
      //     map((val: { readonly [key: string]: any }) =>
      //       Object.keys(val).map(key => val[key] as T)
      //     ),
      //     tap(value => this.cache(path.toString(), value)),
      //     catchError(err => {
      //       // TODO
      //       return of([])
      //     })
      //   )
    })
    // console.log(query.firestore)
  }

  cacheKey(path: string) {
    return makeStateKey<string>(`${this.prefix}.${path}`)
  }

  cache(path: string, value: any) {
    this.ts.set(this.cacheKey(path), value)
  }
}
