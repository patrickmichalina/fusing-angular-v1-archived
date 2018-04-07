/* tslint:disable */
import * as Nightmare from 'nightmare'
import { NIGHTMARE_URL as baseUrl } from '../config/build.config'
import { argv } from 'yargs'

const isCi = argv.ci

jasmine.DEFAULT_TIMEOUT_INTERVAL = 225000

// tslint:disable:no-require-imports
const browser = require('nightmare')({
  show: isCi ? false : true
}) as Nightmare

export { browser, baseUrl }
