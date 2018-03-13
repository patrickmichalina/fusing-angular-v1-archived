import { InjectionToken } from '@angular/core'
import { EnvConfig } from '../../../tools/config/app.config'
import { makeStateKey } from '@angular/platform-browser'

export const ENV_CONFIG = new InjectionToken<EnvConfig>('cfg.env')
export const ENV_CONFIG_TS_KEY = makeStateKey<EnvConfig>('cfg.env.ts')
