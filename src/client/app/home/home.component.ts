import { ChangeDetectionStrategy, Component } from '@angular/core'
import { SEO } from '../shared/decorators/seo.decorator'

@Component({
  selector: 'pm-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@SEO({
  title: 'Home',
  description: 'Home page desc'
})
export class HomeComponent {}
