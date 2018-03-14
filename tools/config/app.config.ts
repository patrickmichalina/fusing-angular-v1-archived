export interface EnvConfig {
  readonly env?: string
  readonly endpoints?: {
    readonly api?: string,
    readonly websocketServer?: string
  }
}
