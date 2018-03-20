import { DemosComponent } from './demos.component'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: DemosComponent,
        data: {
          meta: {
            title: 'Demos',
            description: 'Demos page description'
          }
        }
      }
    ])
  ],
  exports: [RouterModule]
})
export class DemosRoutingModule {}
