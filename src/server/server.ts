import { newRelic } from './add-ons/new-relic'
newRelic()
import { createServer } from 'http'
import { argv } from 'yargs'
import { app } from './server.app'
// import { initWebSocketServer } from './server.websockets'
import { initDb } from './server.database'
import chalk from 'chalk'

const port = process.env.PORT || argv['port'] || 5001
const host = process.env.HOST || argv['host'] || 'http://localhost'
const server = createServer(app)
const log = console.log

initDb()
  .then(() => {
    server.listen(port, () => {
      log(chalk.green(`Angular Universal Server listening at ${host}:${port}`))
    })
  })
  .catch(err => {
    throw Error(err)
  })

// export const webSocketServer = initWebSocketServer(server)
