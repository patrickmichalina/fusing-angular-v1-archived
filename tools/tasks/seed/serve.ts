import { Sparky } from 'fuse-box'
import { taskName } from '../../config/build.config'

Sparky.task(
  taskName(__filename),
  [
    'clean',
    'mk-dist',
    'config',
    'icons',
    'markdown',
    'index.copy',
    'web',
    'assets',
    'sass',
    'build.universal',
    'ngsw',
    'banner'
  ],
  () => undefined
)
