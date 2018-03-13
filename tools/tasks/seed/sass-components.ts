import { Sparky } from 'fuse-box'
import { taskName } from '../../config/build.config'
import { exec } from 'child_process';

Sparky.task(taskName(__filename), () => {
  return new Promise((resolve, reject) => {
    exec('./node_modules/.bin/node-sass src -o src', (err, stdout, stderr) => {
      if (err) {
        console.log(err, stdout, stderr)
        return reject(stderr)
      }
      return resolve()
    })
  })
})
