import { Sparky } from 'fuse-box'
import { BUILD_CONFIG, taskName } from '../../config/build.config'
const copy = require('recursive-copy')

// copies font-awesome
Sparky.task(taskName(__filename), () =>
  copy(
    './node_modules/material-design-icons',
    `./${BUILD_CONFIG.outputDir}/assets/svg`,
    {
      filter: ['**/production/**/*.svg'],
      overwrite: true,
      rename: function(filePath: string) {
        return filePath.replace('svg/production', '')
      }
    }
  )
    .then(function(results: any) {
      console.info('Copied ' + results.length + ' files')
    })
    .catch(function(error: any) {
      console.error('Copy failed: ' + error)
    })
)
