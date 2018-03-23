import { Server as wss } from 'ws'
// import { Subject } from 'rxjs/Subject'
// import { sha1 } from 'object-hash'
// import { v4 } from 'uuid'
// import { parse } from 'cookie'
// import { Observable } from 'rxjs/Observable'
import { Server } from 'http'

// interface IncomingMessage {
//   readonly clientId: string
//   readonly clientAuthorizationToken: string
//   readonly channel: string
//   readonly data: Object
// }

export const initWebSocketServer = (server: Server) => {
  const webSocketServer = new wss({ server })
  // const recievedMessages = new Subject<IncomingMessage>()

  // webSocketServer.on('connection', (ws, req) => {
  //   const id = v4()
  //   const clientAuthorizationToken = parse(req.headers.cookie as any)['id-token'];
  //   // tslint:disable-next-line:no-object-mutation
  //   (ws as any).id = id
  //   ws.on('message', e => {
  //     recievedMessages.next({ clientAuthorizationToken, clientId: id, data: e } as any)
  //   })
  // })

  // const eventRouter = (message: IncomingMessage) => {
  //   return Observable.of({ id: 123, name: 'asdasd' })
  // }

  // recievedMessages
  //   .flatMap(eventRouter, (req, res) => ({ req, res }))
  //   .map(e => {
  //     return {
  //       ws: Array.from(webSocketServer.clients).find((a: any) => a.id === e.req.clientId),
  //       req: e.req,
  //       res: e.res
  //     }
  //   })
  //   .filter(Boolean)
  //   .subscribe(e => {
  //     e.ws.send(JSON.stringify(e.res))
  //   })

  return webSocketServer
}

// export const source = new Subject()
// export const output = source
//   .map(a => JSON.stringify(a))
//   .distinctUntilChanged((x, y) => (x && sha1(x)) === (y && sha1(y)))

// output.subscribe(message => {
//   webSocketServer.clients.forEach(cl => cl.send(message))
// })
