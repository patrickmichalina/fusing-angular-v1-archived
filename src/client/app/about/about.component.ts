import { ChangeDetectionStrategy, Component } from '@angular/core'
import { NoteService } from '../shared/services/data/note.service'

@Component({
  selector: 'pm-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent {
  constructor(private ns: NoteService) {}
  readonly notes = this.ns.get()
}
