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

export function callbackModule() {
  return import('./callback/callback.module').then(m => m.CallbackModule)
}

export function logoutModule() {
  return import('./logout/logout.module').then(m => m.LogoutModule)
}

export const routes: Routes = [
  { path: '', loadChildren: homeModule },
  { path: 'about', loadChildren: aboutModule },
  { path: 'demos', loadChildren: demosModule },
  { path: 'callback', loadChildren: callbackModule },
  { path: 'logout', loadChildren: logoutModule }
]

@NgModule({
  imports: [RouterModule.forRoot(routes, { initialNavigation: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
