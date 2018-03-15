export interface EnvConfig {
  readonly siteUrl: string
  readonly env?: string
  readonly endpoints?: {
    readonly api?: string
    readonly websocketServer?: string
  }
}
