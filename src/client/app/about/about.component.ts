import { ChangeDetectionStrategy, Component } from '@angular/core'
import { NoteService } from '../shared/services/data/note.service'
import { INote } from '../../../server/entity/note'
import { of } from 'rxjs/observable/of'
import { catchError } from 'rxjs/operators'

@Component({
  selector: 'pm-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent {
  constructor(private ns: NoteService) {}
  readonly notes = this.ns
    .get()
    .pipe(
      catchError(err => of([{ text: 'failed to load notes', id: 0 } as INote]))
    )

  trackByNote(index: number, note: INote) {
    return note.id
  }
}
