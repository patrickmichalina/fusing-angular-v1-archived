import { EnvConfig } from '../config/app.config'
import * as base from './base'

const DevConfig: EnvConfig = {
  ...base,
  env: 'e2e'
}

export = DevConfig