import { Sparky } from 'fuse-box'
import { taskName } from '../../config/build.config'

Sparky.task(taskName(__filename), ['ngsw-worker', 'ngsw-json'], () => undefined)
