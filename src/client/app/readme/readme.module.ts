import { ReadmeRoutingModule } from './readme-routing.module'
import { ReadmeComponent } from './readme.component'
import { NgModule } from '@angular/core'
import { SharedModule } from '../shared/shared.module'
import { MarkdownToHtmlModule } from 'markdown-to-html-pipe'

@NgModule({
  imports: [ReadmeRoutingModule, SharedModule, MarkdownToHtmlModule],
  declarations: [ReadmeComponent],
  exports: [ReadmeComponent]
})
export class ReadmeModule {}
