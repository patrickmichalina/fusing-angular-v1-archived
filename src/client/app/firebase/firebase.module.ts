import { FirebaseRoutingModule } from './firebase-routing.module'
import { FirebaseComponent } from './firebase.component'
import { NgModule } from '@angular/core'
import { SharedModule } from '../shared/shared.module'

@NgModule({
  imports: [FirebaseRoutingModule, SharedModule],
  declarations: [FirebaseComponent],
  exports: [FirebaseComponent]
})
export class FirebaseModule {}
