import { Ng2TemplatePlugin } from 'ng2-fused'
import { argv } from 'yargs'
import {
  BUILD_CONFIG,
  ENV_CONFIG_INSTANCE,
  isProdBuild,
  typeHelper,
  isServiceWorkerEnabled
} from './tools/config/build.config'
import { WebIndexPlugin } from './tools/plugins/web-index'
import { init, reload, active } from 'browser-sync'
import {
  EnvPlugin,
  FuseBox,
  HTMLPlugin,
  JSONPlugin,
  RawPlugin,
  SassPlugin,
  Sparky,
  QuantumPlugin
} from 'fuse-box'
import './tools/tasks'
import { NgAotPlugin } from './tools/plugins/ng-aot'
import { NgOptimizerPlugin } from './tools/plugins/ng-optimizer'
import { NgSwPlugin } from './tools/plugins/ng-sw'

const death = require('death')
const isReachable = require('is-reachable')
const isAot = argv.aot
const isBuildServer = argv.ci
const baseEntry = isAot ? 'main.aot' : 'main'
const appBundleName = `js/app`
const vendorBundleName = `js/vendors`
const mainEntryFileName = isProdBuild ? `${baseEntry}-prod` : `${baseEntry}`
const vendorBundleInstructions = ` ~ client/${mainEntryFileName}.ts`
const appBundleInstructions = ` !> [client/${mainEntryFileName}.ts]`
const serverBundleInstructions = ' > [server/server.ts]'

isProdBuild && typeHelper()

const baseOptions = {
  homeDir: './src',
  output: `${BUILD_CONFIG.outputDir}/$name.js`,
  plugins: [
    JSONPlugin(),
    Ng2TemplatePlugin(),
    ['*.component.html', RawPlugin()],
    [
      '*.component.css',
      SassPlugin({
        indentedSyntax: false,
        importer: true,
        sourceMap: false,
        outputStyle: 'compressed'
      } as any),
      RawPlugin()
    ],
    HTMLPlugin({ useDefault: false })
  ]
}

const appOptions = {
  ...baseOptions,
  hash: isProdBuild,
  target: 'browser@es5',
  plugins: [
    NgAotPlugin(),
    isServiceWorkerEnabled && NgSwPlugin(),
    isProdBuild && NgOptimizerPlugin(),
    ...baseOptions.plugins,
    WebIndexPlugin({
      base: ENV_CONFIG_INSTANCE.host,
      bundles: [vendorBundleName, appBundleName],
      startingDocumentPath: 'dist/index.html',
      appElement: {
        name: 'pm-app',
        innerHTML: 'Loading....'
      },
      additionalDeps: BUILD_CONFIG.dependencies as any[]
    }),
    isProdBuild &&
      QuantumPlugin({
        warnings: false,
        uglify: true,
        treeshake: true,
        bakeApiIntoBundle: vendorBundleName,
        replaceProcessEnv: false,
        processPolyfill: true,
        ensureES5: true
      })
  ]
}

const serverOptions = {
  ...baseOptions,
  target: 'server',
  sourceMaps: false,
  plugins: [
    EnvPlugin({ ngConfig: JSON.stringify(ENV_CONFIG_INSTANCE) }),
    ...baseOptions.plugins
  ]
}

Sparky.task('build.universal', () => {
  const fuseApp = FuseBox.init(appOptions as any)
  const fuseServer = FuseBox.init(serverOptions as any)
  const path = isAot ? 'client/.aot/src/client/app' : 'client/app'
  const serverBundle = fuseServer
    .bundle('server')
    .instructions(serverBundleInstructions)
  const vendorBundle = fuseApp
    .bundle(`${vendorBundleName}`)
    .instructions(vendorBundleInstructions)

  const addInstructs = isAot
    ? `${appBundleInstructions}`
    : `${appBundleInstructions} + [${path}/**/!(*.spec|*.e2e-spec|*.ngsummary|*.snap).*(!scss)]`

  const appBundle = fuseApp
    .bundle(appBundleName)
    .splitConfig({ dest: 'js/modules' })
    .instructions(addInstructs)

  if (!isBuildServer && !argv['build-only']) {
    const proxy = `${BUILD_CONFIG.host}:${BUILD_CONFIG.port}`
    vendorBundle.watch()
    appBundle.watch()
    return fuseApp.run().then(() => {
      serverBundle.watch('src/**').completed(proc => {
        typeHelper(false, false)
        proc.start()
        isReachable(proxy).then(() => {
          active
            ? reload()
            : init({
                port: BUILD_CONFIG.browserSyncPort,
                ghostMode: false,
                proxy
              })
        })
        death(function(signal: any, err: any) {
          proc.kill()
          process.exit()
        })
      })
      return fuseServer.run()
    })
  } else {
    return fuseApp.run().then(() => fuseServer.run())
  }
})
