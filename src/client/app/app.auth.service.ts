import { AuthService } from './shared/auth/auth.service'
import { Injectable } from '@angular/core'

// You can customize your Auth configuration in this file!

export interface AppUser {
  readonly firstName?: string
  readonly name?: string
}

@Injectable()
export class AppAuthService extends AuthService<AppUser> {}
