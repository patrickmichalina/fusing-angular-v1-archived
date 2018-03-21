import { newRelic } from './add-ons/new-relic'
newRelic()
import { createServer } from 'http'
import { argv } from 'yargs'
import { app } from './server.app'
import { initWebSocketServer } from './server.websockets'
import { initDb } from './server.database'

const port = process.env.PORT || argv['port'] || 5001
const host = process.env.HOST || argv['host'] || 'http://localhost'
const server = createServer(app)

initDb()
  .then(() => {
    server.listen(port, () => {
      // tslint:disable-next-line:no-console
      console.log(`Angular Universal Server listening at ${host}:${port}`)
    })
  })
  .catch(err => {
    throw Error(err)
  })

export const webSocketServer = initWebSocketServer(server)
