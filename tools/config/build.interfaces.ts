import { Dependency } from '../plugins/web-index'

export interface BuildConfiguration {
  readonly dependencies: ReadonlyArray<Dependency>
  readonly baseHref: string
  readonly outputDir: string
  readonly clientAssetsDir: string
  readonly sourceDir: string
  readonly clientDir: string
  readonly prodOutDir: string
  readonly assetParentDir: string
  readonly minifyIndex: boolean
  readonly toolsDir: string
  readonly browserSyncPort: number
  readonly host: string
  readonly port: number
  readonly icons: ReadonlyArray<string>
  readonly favicon: {
    readonly src: string
    readonly config: {
      readonly path: string
      readonly appDescription: string
      readonly appName: string
      readonly short_name: string
      readonly background: string
      readonly theme_color: string
      readonly start_url: string
      readonly lang: string
    }
  }
}
