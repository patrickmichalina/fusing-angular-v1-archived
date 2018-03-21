import { NotesController } from './notes.controller'
import { NgModule } from '@angular/core'

export const controllers: ReadonlyArray<any> = [NotesController]

@NgModule({
  providers: [NotesController]
})
export class ApiControllersModule {}
