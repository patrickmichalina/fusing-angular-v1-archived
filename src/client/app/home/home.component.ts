import { ChangeDetectionStrategy, Component } from '@angular/core'
import { SEO } from '../shared/decorators/seo.decorator'
import { Injections } from '../shared/decorators/injection.decorator'

@Component({
  selector: 'pm-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@SEO({
  title: 'Home',
  description: 'Some cool desc that needs to show up in meta tags'
})
@Injections([
  {
    element: 'script',
    attributes: { src: 'https://code.jquery.com/jquery-3.3.1.min.js' },
    inHead: true
  }
])
export class HomeComponent {}
