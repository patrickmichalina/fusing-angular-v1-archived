import { NotFoundComponent } from './not-found.component'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '**',
        component: NotFoundComponent,
        data: {
          meta: {
            title: 'Not Found',
            description: 'Sorrt that page was not found'
          }
        }
      }
    ])
  ],
  exports: [RouterModule]
})
export class NotFoundRoutingModule {}
