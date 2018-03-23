import { Sparky } from 'fuse-box'
import { BUILD_CONFIG, taskName } from '../../config/build.config'

Sparky.task(taskName(__filename), () =>
  Sparky.src(['!(node_modules|dist)/**/*.md', 'README.md'], { base: '.' }).dest(
    `./${BUILD_CONFIG.outputDir}/assets/md`
  )
)
