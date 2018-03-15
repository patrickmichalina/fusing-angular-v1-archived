import { EnvConfig } from '../config/app.config'

const BaseConfig: EnvConfig = {
  siteUrl: 'http://localhost:8000',
  endpoints: {
    api: 'http://localhost:8000/api'
  }
}

export = BaseConfig
