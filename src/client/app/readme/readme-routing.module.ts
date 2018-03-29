import { ReadmeComponent } from './readme.component'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ReadmeComponent,
        data: {
          meta: {
            title: 'Readme',
            description: 'Readme description'
          }
        }
      }
    ])
  ],
  exports: [RouterModule]
})
export class ReadmeRoutingModule {}
