import { newRelic } from './add-ons/new-relic'
newRelic()
import { createServer } from 'http'
import { argv } from 'yargs'
import { app } from './server.app'

const port = process.env.PORT || argv['port'] || 8001
const host = process.env.HOST || argv['host'] || 'http://localhost'

createServer(app).listen(port, () => {
  console.log(`Angular Universal Server listening at ${host}:${port}`)
})
