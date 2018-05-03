import { InjectionToken, Injector, NgModule, NgZone } from '@angular/core'
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

export const FIREBASE_USER_AUTH_TOKEN = new InjectionToken<string>(
  'cfg.fb.svr.usr.auth'
)

export function authGen(auth: AuthService) {
  return auth.getCustomFirebaseToken() || ''
}

@NgModule({
  providers: [
    {
      provide: UniversalRtDbService,
      useClass: ServerUniversalRtDbService,
      deps: [
        TransferState,
        HttpClient,
        NgZone,
        Injector,
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
