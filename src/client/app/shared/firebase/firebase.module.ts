import { NgModule } from '@angular/core'
import {
  FIREBASE_FIRESTORE_TS_PREFIX,
  UniversalFirestoreService
} from './firebase-firestore.service'
import {
  FIREBASE_RTDB_TS_PREFIX,
  UniversalRtDbService
} from './firebase-rtdb.service'
import {
  AngularFireModule,
  FirebaseAppConfig,
  FirebaseAppName
} from 'angularfire2'
import { AngularFireDatabaseModule } from 'angularfire2/database'
import { AngularFirestoreModule } from 'angularfire2/firestore'
import { EnvironmentService } from '../services/environment.service'
import { AngularFireAuthModule } from 'angularfire2/auth'

export function firebaseConfigLoader(env: EnvironmentService) {
  return env.config.firebase
}

@NgModule({
  imports: [
    AngularFireModule,
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireAuthModule
  ],
  exports: [
    AngularFireModule,
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireAuthModule
  ],
  providers: [
    { provide: FIREBASE_FIRESTORE_TS_PREFIX, useValue: 'FS' },
    { provide: FIREBASE_RTDB_TS_PREFIX, useValue: 'RTDB' },
    {
      provide: FirebaseAppName,
      useValue: 'universal-webapp'
    },
    {
      provide: FirebaseAppConfig,
      useFactory: firebaseConfigLoader,
      deps: [EnvironmentService]
    },
    UniversalFirestoreService,
    UniversalRtDbService
  ]
})
export class FirebaseModule {}