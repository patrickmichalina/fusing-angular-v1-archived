import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core'
import { SEO } from '../shared/decorators/seo.decorator'

@Component({
  selector: 'pm-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@SEO({
  title: 'About',
  description: 'About page desc'
})
export class AboutComponent implements OnInit, OnDestroy {
  ngOnInit() {
    // AOT does not work with the SEO decorator unless this is present
  }
  ngOnDestroy() {
    // AOT does not work with the SEO decorator unless this is present
  }
}
