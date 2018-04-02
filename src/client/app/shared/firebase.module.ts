import { NgModule } from '@angular/core'
import {
  FIREBASE_FIRESTORE_TS_PREFIX,
  UniversalFirestoreService
} from './services/firebase-firestore.service'
import {
  FIREBASE_RTDB_TS_PREFIX,
  UniversalRtDbService
} from './services/firebase-rtdb.service'
import {
  AngularFireModule,
  FirebaseAppConfigToken,
  FirebaseAppName
} from 'angularfire2'
import { AngularFireDatabaseModule } from 'angularfire2/database'
import { AngularFirestoreModule } from 'angularfire2/firestore'
import { EnvironmentService } from './services/environment.service'

export function firebaseConfigLoader(env: EnvironmentService) {
  return env.config.firebase
}

@NgModule({
  imports: [
    AngularFireModule,
    AngularFireDatabaseModule,
    AngularFirestoreModule
  ],
  exports: [
    AngularFireModule,
    AngularFireDatabaseModule,
    AngularFirestoreModule
  ],
  providers: [
    { provide: FIREBASE_FIRESTORE_TS_PREFIX, useValue: 'FS' },
    { provide: FIREBASE_RTDB_TS_PREFIX, useValue: 'RTDB' },
    {
      provide: FirebaseAppName,
      useValue: 'universal-webapp',
      deps: [EnvironmentService]
    },
    {
      provide: FirebaseAppConfigToken,
      useFactory: firebaseConfigLoader,
      deps: [EnvironmentService]
    },
    UniversalFirestoreService,
    UniversalRtDbService
  ]
})
export class FirebaseModule {}
