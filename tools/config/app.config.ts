export interface EnvConfig {
  readonly siteUrl: string
  readonly env?: string
  readonly endpoints?: {
    readonly api?: string
    readonly websocketServer?: string
  }
  readonly auth0?: {
    readonly clientID: string
    readonly domain: string
    readonly redirectUri: string
    readonly responseType: string
    readonly scope: string
  }
}
