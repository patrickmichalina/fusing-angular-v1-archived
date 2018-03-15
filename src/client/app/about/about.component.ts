import { ChangeDetectionStrategy, Component } from '@angular/core'
import { SEO } from '../shared/decorators/seo.decorator'

@Component({
  selector: 'pm-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@SEO({
  title: 'About',
  description: 'About this page'
})
export class AboutComponent {}
