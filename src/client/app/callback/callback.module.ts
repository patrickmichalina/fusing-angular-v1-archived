import { CallbackRoutingModule } from './callback-routing.module'
import { CallbackComponent } from './callback.component'
import { NgModule } from '@angular/core'
import { SharedModule } from '../shared/shared.module'

@NgModule({
  imports: [CallbackRoutingModule, SharedModule],
  declarations: [CallbackComponent],
  exports: [CallbackComponent]
})
export class CallbackModule {}
