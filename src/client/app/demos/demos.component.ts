import { ChangeDetectionStrategy, Component } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'

interface User {
  readonly id: string
  readonly first_name: string
}

interface ApiResponse {
  readonly data: ReadonlyArray<User>
}

@Component({
  selector: 'pm-demos',
  templateUrl: './demos.component.html',
  styleUrls: ['./demos.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemosComponent {
  readonly users$ = this.http
    .get<ApiResponse>('https://reqres.in/api/users')
    .map(a => a.data)
    .catch(a => Observable.of([{ first_name: 'Error loading user from API' }]))

  constructor(private http: HttpClient) {}

  trackByUser(index: number, item: User) {
    return item.id
  }
}
