import { Dependency } from '../plugins/web-index'

export interface BuildConfiguration {
  dependencies: Dependency[]
  baseHref: string
  outputDir: string
  clientAssetsDir: string
  sourceDir: string
  clientDir: string
  prodOutDir: string
  assetParentDir: string
  minifyIndex: boolean
  toolsDir: string
  browserSyncPort: number
  host: string
  port: number
  icons: string[]
  favicon: {
    src: string
    config: {
      path: string
      appDescription: string
      appName: string
      short_name: string
      background: string
      theme_color: string
      start_url: string
      lang: string
    }
  }
}
