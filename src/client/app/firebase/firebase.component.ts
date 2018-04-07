import { ChangeDetectionStrategy, Component } from '@angular/core'
import { UniversalRtDbService } from '../shared/firebase/firebase-rtdb.service'
import { UniversalFirestoreService } from '../shared/firebase/firebase-firestore.service'
import { FormControl, FormGroup, Validators } from '@angular/forms'

@Component({
  selector: 'pm-firebase',
  templateUrl: './firebase.component.html',
  styleUrls: ['./firebase.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FirebaseComponent {
  readonly notes$ = this.rtdb.serverCachedListValueChanges('notes', ref =>
    ref.limitToLast(3)
  )
  readonly rtdbObj$ = this.rtdb.serverCachedObjectValueChanges(
    'site-settings/i18n'
  )
  readonly docs$ = this.fs.serverCachedCollectionValueChanges('docs')

  readonly noteForm = new FormGroup({
    note: new FormControl(undefined, [Validators.required])
  })

  readonly docsForm = new FormGroup({
    title: new FormControl(undefined, [Validators.required]),
    rating: new FormControl(1, [])
  })

  constructor(
    private rtdb: UniversalRtDbService,
    private fs: UniversalFirestoreService
  ) {}

  addNote(note: string) {
    this.rtdb.angularFireDatabase.list('notes').push(note)
  }

  clearNotes() {
    this.rtdb.angularFireDatabase.list('notes').remove()
  }

  addDoc(doc: any) {
    this.fs.afs.collection('docs').add(doc)
  }

  clearDocs() {
    // TODO: this.fs.afs.collection('docs').delete()
  }

  trackByDoc(index: number, item: any) {
    return item.title
  }

  trackByNote(index: number, item: string) {
    return item
  }
}
