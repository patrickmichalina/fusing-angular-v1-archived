import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core'
import { SEO } from '../shared/decorators/seo.decorator'
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
@SEO({
  title: 'Demos',
  description: 'Demos page desc'
})
export class DemosComponent implements OnInit, OnDestroy {
  readonly users$ = this.http
    .get<ApiResponse>('https://reqres.in/api/users')
    .map(a => a.data)
    .catch(a => Observable.of([{ first_name: 'Error loading user from API' }]))

  constructor(private http: HttpClient) {}

  trackByUser(index: number, item: User) {
    return item.id
  }

  ngOnInit() {
    // AOT does not work with the SEO decorator unless this is present
  }
  ngOnDestroy() {
    // AOT does not work with the SEO decorator unless this is present
  }
}
