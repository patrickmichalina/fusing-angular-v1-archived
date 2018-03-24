import { Sparky } from 'fuse-box'
import { taskName } from '../../config/build.config'

Sparky.task(
  taskName(__filename),
  [
    'clean',
    'mk-dist',
    'config',
    'markdown',
    'tmp-ng6-upgrade',
    'index.copy',
    'fonts',
    'web',
    'assets',
    'sass',
    'build.universal',
    'ngsw',
    'banner'
  ],
  () => undefined
)
