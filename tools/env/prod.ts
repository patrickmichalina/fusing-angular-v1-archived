import { EnvConfig } from '../config/app.config'
import * as base from './base'

const ProdConfig: EnvConfig = { 
  ...base,
  env: 'prod'
};

export = ProdConfig;