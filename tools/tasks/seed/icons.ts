import { Sparky } from 'fuse-box'
import { BUILD_CONFIG, taskName } from '../../config/build.config'
const copy = require('recursive-copy')

const filter = BUILD_CONFIG.icons.map(a => {
  return `**/production/ic_${a}_**.svg`
})

// copies font-awesome
// TODO: speed up the REGEX!
Sparky.task(taskName(__filename), () =>
  copy(
    './node_modules/material-design-icons',
    `./${BUILD_CONFIG.outputDir}/assets/svg`,
    {
      filter,
      overwrite: true,
      rename: function(filePath: string) {
        return (filePath.split('/').pop() || '')
          .replace('ic_', '')
          .replace('px.svg', '.svg')
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
