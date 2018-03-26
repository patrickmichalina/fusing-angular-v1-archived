import { Injectable } from '@angular/core'
import { v4 } from 'uuid'

@Injectable()
export class IdService {
  generateId() {
    return v4()
  }
}
