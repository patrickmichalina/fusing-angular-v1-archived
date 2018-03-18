import { EnvConfig } from '../config/app.config'

const BaseConfig: EnvConfig = {
  siteUrl: 'http://localhost:5000',
  endpoints: {
    api: 'http://localhost:5000/api'
  }
}

export = BaseConfig
