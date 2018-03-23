import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation
} from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { of } from 'rxjs/observable/of'
import { catchError } from 'rxjs/operators'

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
    .get('./assets/md/README.md', {
      responseType: 'text'
    })
    .pipe(catchError(err => of('Error loading README.md')))
}
