import { DemosRoutingModule } from './demos-routing.module'
import { DemosComponent } from './demos.component'
import { NgModule } from '@angular/core'
import { SharedModule } from '../shared/shared.module'

@NgModule({
  imports: [DemosRoutingModule, SharedModule],
  declarations: [DemosComponent],
  exports: [DemosComponent]
})
export class DemosModule {}
