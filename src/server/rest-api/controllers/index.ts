import { NotesController } from './notes/notes.controller'
import { UsersController } from './users/users.controller'
import { NgModule } from '@angular/core'

export const controllers: ReadonlyArray<any> = [
  NotesController,
  UsersController
]

@NgModule({
  providers: [NotesController, UsersController]
})
export class ApiControllersModule {}
