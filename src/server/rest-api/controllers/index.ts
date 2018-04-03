import { NotesController } from './notes/notes.controller'
import { UsersController } from './users/users.controller'
import { AuthController } from './auth/auth.controller'

export const controllers: ReadonlyArray<any> = [
  NotesController,
  UsersController,
  AuthController
]
