import { AccountComponent } from './account.component'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { LoggedInGuard } from '../shared/services/guards/logged-in.guard.service'

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: AccountComponent,
        canActivate: [LoggedInGuard],
        data: {
          meta: {
            title: 'Account'
          }
        }
      }
    ])
  ],
  exports: [RouterModule]
})
export class AccountRoutingModule {}
