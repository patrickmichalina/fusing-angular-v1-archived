import { HomeRoutingModule } from './home-routing.module'
import { HomeComponent } from './home.component'
import { NgModule } from '@angular/core'
import { SharedModule } from '../shared/shared.module'
import { MarkdownToHtmlModule } from 'markdown-to-html-pipe'

@NgModule({
  imports: [HomeRoutingModule, SharedModule, MarkdownToHtmlModule],
  declarations: [HomeComponent],
  exports: [HomeComponent]
})
export class HomeModule {}
