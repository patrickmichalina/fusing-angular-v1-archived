import { Sparky, FuseBox, UglifyJSPlugin } from 'fuse-box'
import { taskName, isProdBuild } from '../../config/build.config'

Sparky.task(taskName(__filename), () => {
  const fuseApp = FuseBox.init({
    homeDir: 'node_modules/@angular/service-worker',
    output: 'dist/$name.js',
    target: 'browser@es5',
    plugins: [isProdBuild && (UglifyJSPlugin() as any)]
  })
  fuseApp.bundle('ngsw-worker.js').instructions(' > [ngsw-worker.js]')
  return fuseApp.run()
})
