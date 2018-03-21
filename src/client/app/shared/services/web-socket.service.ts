import { Injectable } from '@angular/core'
import { WebSocketSubject } from 'rxjs/observable/dom/WebSocketSubject'
import { AuthService } from './auth.service'

@Injectable()
export class WebSocketService {
  private readonly source = new WebSocketSubject<any>({
    url: 'ws://localhost:5001'
  })

  public readonly messageBus$ = this.source.asObservable()

  constructor(auth: AuthService) {
    // auth.user$.subscribe(user => {
    //   this.disconnect()
    // })
  }

  valueChanges(channel: string) {
    // this.send({
    // channel
    // })
  }

  // private send(obj: Object) {
  //   this.source.next(JSON.stringify(obj))
  // }

  disconnect() {
    this.source.unsubscribe()
  }

  reconnect() {
    // this.source = new WebSocketSubject<any>({
    //   url: 'ws://localhost:5001'
    // })
  }
}
