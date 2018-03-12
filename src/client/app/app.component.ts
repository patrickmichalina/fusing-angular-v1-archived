import { ChangeDetectionStrategy, Component } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'

@Component({
  selector: 'pm-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  constructor(http: HttpClient) {
    http
      .get('https://jsonplaceholder.typicode.com/posts/1')
      .take(1)
      .catch(err => Observable.of(1))
      .subscribe()
  }
}
