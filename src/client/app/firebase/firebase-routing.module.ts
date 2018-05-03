import { FirebaseComponent } from './firebase.component'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: FirebaseComponent,
        data: {
          meta: {
            title: 'Firebase'
          }
        }
      }
    ])
  ],
  exports: [RouterModule]
})
export class FirebaseRoutingModule {}
