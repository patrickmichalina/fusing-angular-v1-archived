import { ChangeDetectionStrategy, Component } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { of } from 'rxjs/observable/of'
import { catchError, map } from 'rxjs/operators'

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
    .pipe(
      map(a => a.data),
      catchError(a => of([{ first_name: 'Error loading user from API' }]))
    )

  constructor(private http: HttpClient) {}

  trackByUser(index: number, item: User) {
    return item.id
  }
}
