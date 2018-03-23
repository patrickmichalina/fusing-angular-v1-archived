import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation
} from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'

@Component({
  selector: 'pm-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent {
  constructor(private http: HttpClient) {}
  readonly page$ = this.http
    .get('./assets/md/readme.md', {
      responseType: 'text'
    })
    .catch(err => Observable.of(err))
}
