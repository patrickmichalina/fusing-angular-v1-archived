import { CallbackComponent } from './callback.component'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: CallbackComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class CallbackRoutingModule {}
