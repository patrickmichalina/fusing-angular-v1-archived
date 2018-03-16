import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

export function homeModule() {
  return import('./home/home.module').then(m => m.HomeModule)
}

export function aboutModule() {
  return import('./about/about.module').then(m => m.AboutModule)
}

export function demosModule() {
  return import('./demos/demos.module').then(m => m.DemosModule)
}

export const routes: Routes = [
  { path: '', loadChildren: homeModule },
  { path: 'about', loadChildren: aboutModule },
  { path: 'demos', loadChildren: demosModule }
]

@NgModule({
  imports: [RouterModule.forRoot(routes, { initialNavigation: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
