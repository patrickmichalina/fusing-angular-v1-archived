export interface EnvConfig {
  readonly siteUrl: string
  readonly appName: string
  readonly appShortName?: string
  readonly env?: string
  readonly revision?: string
  readonly rolesKey?: string
  readonly pwaUpdateInterval?: number
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
