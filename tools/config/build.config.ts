import { BuildConfiguration } from './build.interfaces'
import { argv } from 'yargs'
import { basename } from 'path'
import { OVERRIDES } from './build.ci.replace'

export const BUILD_CONFIG: BuildConfiguration = {
  baseHref: '/',
  outputDir: 'dist',
  sourceDir: 'src',
  clientDir: 'src/client',
  clientAssetsDir: 'src/client/assets',
  prodOutDir: './dist/prod',
  assetParentDir: 'src/client',
  toolsDir: './tools',
  minifyIndex: true,
  browserSyncPort: 5000,
  host: 'http://localhost',
  port: 5001,
  favicon: {
    src: './src/client/assets/svg/logo.svg',
    config: {
      path: '/assets/favicons',
      appDescription: 'starter repo for fast Angular Universal app development',
      appName: 'Fusing Angular',
      short_name: 'Fusing-Ng',
      background: '#ffffff',
      theme_color: '#ffffff',
      start_url: '/index.html',
      lang: 'en-US'
    }
  },
  dependencies: [
    {
      inHead: true,
      element: 'meta',
      attributes: {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, viewport-fit=cover'
      }
    }
  ] as any[],
  icons: [
    'account_circle',
    'menu',
    'book',
    'functions',
    'important_devices',
    'storage',
    'home',
    'airplanemode_inactive',
    'exit_to_app'
  ]
}

let envConfig
const selectedEnv = argv['env-config'] || 'dev'
const selectedBuildType = argv['build-type'] || 'dev'

// tslint:disable:no-require-imports
try {
  envConfig = { ...require(`../env/${selectedEnv}`), ...OVERRIDES }
} catch (err) {
  throw new Error(
    `Unable to find environment configuration for '${selectedEnv}' `
  )
}

const TypeHelper = require('fuse-box-typechecker').TypeHelper

export const taskName = (nodeFilename: string) =>
  basename(nodeFilename).replace('.ts', '')
export const ENV_CONFIG_INSTANCE = envConfig
export const cdn = process.env.CDN_ORIGIN ? process.env.CDN_ORIGIN : undefined
export const isBuildServer: boolean = argv.ci
export const isAot: boolean = argv.aot
export const isProdBuild =
  selectedBuildType === 'prod' ||
  selectedBuildType === 'production' ||
  process.env.NODE_ENV === 'prod' ||
  process.env.NODE_ENV === 'production'

export const typeHelper = (sync = true, throwOnTsLint = true) => {
  const _runner = TypeHelper({
    basePath: './src',
    tsConfig: './tsconfig.json',
    tsLint: './tslint.json',
    name: 'App typechecker',
    throwOnTsLint
  })
  sync ? _runner.runSync() : _runner.runAsync()
}
