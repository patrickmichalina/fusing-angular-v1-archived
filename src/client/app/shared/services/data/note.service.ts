import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import { HttpClient } from '@angular/common/http'
import { INote } from '../../../../../server/entity/note'

export interface INoteService {
  readonly notes: Observable<ReadonlyArray<INote>>
}

@Injectable()
export class NoteService {
  constructor(private http: HttpClient) {}

  get() {
    return this.http.get('./api/notes')
  }
}
