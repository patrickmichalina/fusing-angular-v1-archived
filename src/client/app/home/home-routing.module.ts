import { HomeComponent } from './home.component'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: HomeComponent,
        data: {
          meta: {
            title: 'Home',
            description: 'Home page description'
          }
        }
      }
    ])
  ],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
