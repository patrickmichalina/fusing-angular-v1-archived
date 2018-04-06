import { InjectionToken, NgModule, NgZone } from '@angular/core'
// import { initializeApp } from 'firebase/app'
import {
  FIREBASE_RTDB_TS_PREFIX,
  UniversalRtDbService
} from '../../../client/app/shared/firebase/firebase-rtdb.service'
import { ServerUniversalRtDbService } from './server.firebase-rtdb.service'
import { UniversalFirestoreService } from '../../../client/app/shared/firebase/firebase-firestore.service'
import { ServerUniversalFirestoreService } from './server.firebase-firestore.service'
import { AuthService } from '../../../client/app/shared/services/auth.service'
import { TransferState } from '@angular/platform-browser'
import { HttpClient } from '@angular/common/http'
import { credential, initializeApp } from 'firebase-admin'

try {
  initializeApp({
    credential: credential.cert({
      privateKey:
        process.env.FIREBASE_PRIVATE_KEY &&
        process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  })
} catch (err) {
  // tslint:disable-next-line:no-console
  console.error(err)
}

export const FIREBASE_USER_AUTH_TOKEN = new InjectionToken<string>(
  'cfg.fb.svr.usr.auth'
)

export function authGen(auth: AuthService) {
  return auth.getCustomFirebaseToken() || ''
}

@NgModule({
  imports: [],
  // exports: [],
  providers: [
    {
      provide: UniversalRtDbService,
      useClass: ServerUniversalRtDbService,
      deps: [
        TransferState,
        HttpClient,
        NgZone,
        FIREBASE_RTDB_TS_PREFIX,
        FIREBASE_USER_AUTH_TOKEN
      ]
    },
    {
      provide: UniversalFirestoreService,
      useClass: ServerUniversalFirestoreService
    },
    {
      provide: FIREBASE_USER_AUTH_TOKEN,
      useFactory: authGen,
      deps: [AuthService]
    }
  ]
})
export class FirebaseServerModule {}
