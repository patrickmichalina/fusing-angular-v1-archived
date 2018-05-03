import { FIREBASE_FIRESTORE_TS_PREFIX } from '../../../client/app/shared/firebase/firebase-firestore.service'
import { makeStateKey, TransferState } from '@angular/platform-browser'
import { Inject, Injectable } from '@angular/core'
import { AngularFirestore, QueryFn } from 'angularfire2/firestore'
import { AuthService } from '../../../client/app/shared/services/auth.service'
import { map, tap } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http'
import { of } from 'rxjs'
import { FieldPath } from '@firebase/firestore-types'

interface HttpResponseDocument {
  readonly name: string
  readonly fields: any
}

interface HttpResponseDocumentWrapper {
  readonly document: HttpResponseDocument
}

interface OrderBy {
  readonly field: any
  readonly dir: any
  readonly isKeyOrderBy: boolean
}

interface RelationFilter {
  readonly field: FieldPath
  readonly op: { readonly name: string }
  readonly value: Object
}

const mapOrderBy = (ordBy: OrderBy) => {
  return {
    field: {
      fieldPath: ordBy.field.segments.pop()
    },
    direction: ordBy.dir.name
      ? ordBy.dir.name === 'desc'
        ? 'DESCENDING'
        : 'ASCENDING'
      : 'DIRECTION_UNSPECIFIED'
  }
}

const mapOrderByCollection = (ordBy: ReadonlyArray<OrderBy>) => {
  return ordBy.map(a => mapOrderBy(a))
}

@Injectable()
export class ServerUniversalFirestoreService {
  constructor(
    private ts: TransferState,
    public afs: AngularFirestore,
    private auth: AuthService,
    private http: HttpClient,
    @Inject(FIREBASE_FIRESTORE_TS_PREFIX) private prefix: string
  ) {}

  serverCachedDocValueChanges<T>(path: string) {
    // console.log(this.auth.getCustomFirebaseToken())
    // try {
    //   return fromPromise(this.fbAuth.auth
    //     .pipe(flatMap(() => this.afs.doc<T>(path)
    //       .valueChanges()
    //       .pipe(
    //         tap(value => this.cache(path, value)),
    //         catchError(err => of(undefined))
    //       )))
    // } catch (err) {
    //   return of(undefined)
    // }

    // .then(console.log).then(console.log)
    // firestore()
    //   .doc(path).get().then(snap => {
    //     snap.
    //       console.log(snap.data())
    //     return snap.data()
    //   })

    return of({} as T)
    // .valueChanges()
    // .pipe(
    //   tap(value => this.cache(path, value)),
    //   catchError(err => of(undefined))
    // )
  }

  serverCachedCollectionValueChanges<T>(path: string, queryFn?: QueryFn) {
    const ref = this.afs.firestore.collection(path)
    const query = (queryFn && queryFn(ref as any)) || ref

    const limit = (query as any)._query.limit
    const filters = (query as any)._query.filters as ReadonlyArray<
      RelationFilter
    >
    const orderBy = (query as any)._query.explicitOrderBy as ReadonlyArray<
      OrderBy
    >

    // tslint:disable-next-line:no-console
    console.log(filters)

    const url = `https://firestore.googleapis.com/v1beta1/projects/${
      (this.afs.firestore.app.options as any).projectId
    }/databases/(default)/documents:runQuery`

    const structuredQuery = {
      limit,
      from: [{ collectionId: path }],
      orderBy: mapOrderByCollection(orderBy)
    }

    const fbToken = this.auth.getCustomFirebaseToken()
    const baseObs =
      fbToken !== undefined
        ? this.http.post(
            url,
            { structuredQuery },
            { headers: { Authorization: `Bearer ${fbToken}` } }
          )
        : this.http.post(url, { structuredQuery })

    return baseObs.pipe(
      map((docs: ReadonlyArray<HttpResponseDocumentWrapper>) => {
        return docs.map(doc => this.reduceFields(doc.document.fields) as T)
      }),
      tap(value => this.cache(path.toString(), value))
    )
  }

  reduceFields(fields: any) {
    return Object.keys(fields).reduce((acc, curr) => {
      const converted = this.extractFieldType(fields[curr]) as any
      const innerKey = Object.keys(converted).pop()
      return {
        ...acc,
        [curr]: innerKey && converted[innerKey]
      }
    }, {})
  }

  extractFieldType(obj: any) {
    return Object.keys(obj).reduce((acc, curr) => {
      return {
        ...acc,
        [curr]: this.coerceType(curr, obj[curr])
      }
    }, {})
  }

  coerceType(type: string, value: any): any {
    switch (type) {
      case 'booleanValue':
        return value
      case 'stringValue':
        return value
      case 'integerValue':
        return +value
      case 'arrayValue':
        return (value.values as ReadonlyArray<any>).map(obj => {
          return Object.keys(obj).reduce((acc, curr, idx) => {
            return this.coerceType(curr, obj[curr])
          }, {})
        })
      case 'mapValue':
        return this.reduceFields(value.fields)
      case 'nullValue':
        return undefined
      default:
        return undefined
    }
  }

  cacheKey(path: string) {
    return makeStateKey<string>(`${this.prefix}.${path}`)
  }

  cache(path: string, value: any) {
    this.ts.set(this.cacheKey(path), value)
  }
}
// this.afs.firestore.collection(path).onSnapshot(a => a.docs.map(v => v.data()))
// console.log(query)
// this.afs.firestore
// this.at.auth
// tslint:disable-next-line:no-console
// return fromPromise(ref.get().then(b => b.docs.map(c => c.data() as T)))
// return fromPromise(query.get().then(b => b.docs.map(c => c.data() as T)))
// return of([] as ReadonlyArray<T>)
// return this.zone.runTask<any>(() => {
//   return this.auth.user$.pipe(
//     // flatMap(user => {
//     //   return fbAuth()
//     //     .createCustomToken(user && user.sub)
//     //     .then(customToken => this.at.auth.signInWithCustomToken(customToken))
//     // }),
//     flatMap(() => query.get().then(b => b.docs.map(c => c.data() as T))),
//     take(1),
//     tap(value => this.cache(path, value)),
//     tap(console.log))
// })
//   // console.log(this.afs.firestore.collection(path).firestore)
//   // return of([])
// query.onSnapshot(obs => obs.)
// return fromPromise(query.get().then(b => b.docs.map(c => c.data() as T)), queueScheduler)
//   // return fromPromise(this.test()).pipe(map(a => []))
//   // const roles = (user && user[process.env.AUTH0_ROLES_KEY as string]) || {}
//   // return of([])
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
// })
// console.log(query.firestore)
