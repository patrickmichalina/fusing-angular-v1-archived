import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core'
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
export class HomeComponent implements OnInit, OnDestroy {
  ngOnInit() {
    // AOT does not work with the SEO decorator unless this is present
  }
  ngOnDestroy() {
    // AOT does not work with the SEO decorator unless this is present
  }
}
