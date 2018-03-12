import { BuildConfiguration } from './build.interfaces'
import { argv } from 'yargs'
import { basename } from 'path'
import { OVERRIDES } from './build.ci.replace'
import { Dependency } from '../plugins/web-index'

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
  browserSyncPort: 8000,
  host: 'http://localhost',
  port: 8001,
  favicon: {
    src: './tools/sources/favicon.png',
    config: {
      path: '/assets/favicons',
      appDescription: 'starter repo for fast Angular Universal app development',
      appName: 'Fusing Angular',
      short_name: 'Fusing-Ng',
      background: '#7c4dff',
      theme_color: '#7c4dff',
      start_url: '.',
      lang: 'en'
    }
  },
  dependencies: [
    {
      inHead: true,
      element: 'meta',
      attributes: {
        name: 'viewport',
        content: 'width=device-width,initial-scale=1,maximum-scale=1,user-scalable=0'
      }
    },
    {
      inHead: true,
      element: 'meta',
      shouldExecute: (dep: Dependency) => process.env.GOOGLE_VERIFICATION_CODE && process.env.GOOGLE_VERIFICATION_ENABLED,
      attributes: {
        name: 'google-site-verification',
        content: process.env.GOOGLE_VERIFICATION_CODE
      }
    },
    {
      inHead: true,
      element: 'script',
      content: `window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;ga('create', '${process.env.GOOGLE_ANALYTICS_TRACKING_ID}', 'auto');`,
      shouldExecute: (dep: Dependency) => process.env.GOOGLE_ANALYTICS_TRACKING_ID && process.env.GOOGLE_ANALYTICS_ENABLED,
      attributes: {
        async: true
      }
    },
    {
      inHead: false,
      element: 'script',
      shouldExecute: (dep: Dependency) => process.env.GOOGLE_ANALYTICS_TRACKING_ID && process.env.GOOGLE_ANALYTICS_ENABLED,
      attributes: {
        src: 'https://www.google-analytics.com/analytics.js',
        async: true
      }
    }
  ] as any[]
}

let envConfig
const selectedEnv = argv['env-config'] || 'dev'
const selectedBuildType = argv['build-type'] || 'dev'

// tslint:disable:no-require-imports
try {
  envConfig = { ...require(`../env/${selectedEnv}`), ...OVERRIDES }
} catch (err) {
  throw new Error(`Unable to find environment configuration for '${selectedEnv}' `)
}

const TypeHelper = require('fuse-box-typechecker').TypeHelper

export const taskName = (nodeFilename: string) => basename(nodeFilename).replace('.ts', '')
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
  sync
    ? _runner.runSync()
    : _runner.runAsync()
}
