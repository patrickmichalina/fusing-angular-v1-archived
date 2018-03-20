import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation
} from '@angular/core'

@Component({
  selector: 'pm-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent {}
