import { LogoutComponent } from './logout.component'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: LogoutComponent,
        data: {
          meta: {
            title: 'Logout'
          }
        }
      }
    ])
  ],
  exports: [RouterModule]
})
export class LogoutRoutingModule {}
