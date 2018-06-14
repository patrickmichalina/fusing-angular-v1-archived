import { Injectable } from '@angular/core'
import { parse } from 'uri-js'
import { LoggingService } from './logging.service'

export interface IUrlService {
  // returns hostname with TLD only
  // ex: api.something.com => something.com
  parseBaseDomain(url: string): string

  // returns hostname with no TLD
  // ex: api.something.com => something
  parseRootDomain(url: string): string

  // decodes a URL formatted string into a human readable version
  decode(url: string | undefined): string | undefined
  getHost(url: string): string | undefined
}

@Injectable()
export class UrlService implements IUrlService {
  decode(url: string | undefined): string | undefined {
    if (!url) return undefined
    try {
      return decodeURI(url)
    } catch (e) {
      this.ls.warn(`URI failed to parse: ${url}, returning undefined`, e)
      return undefined
    }
  }

  parseBaseDomain(url: string): string {
    let _url = url

    if (!_url.includes('://')) _url = `http://${_url}`

    const parsed = parse(_url)

    if (!parsed || !parsed.host) throw new Error('Unable to determine url host')

    return parsed.host
      .split('.')
      .slice(-2)
      .join('.')
  }

  parseRootDomain(url: string): string {
    let _url = url

    if (!_url.includes('://')) _url = `http://${_url}`

    const parsed = parse(_url)

    if (!parsed || !parsed.host) throw new Error('Unable to determine url host')

    return parsed.host.split('.').slice(-2)[0]
  }

  getComponents(url: string) {
    return parse(url)
  }

  getHost(url: string) {
    return this.getComponents(url).host
  }

  constructor(private ls: LoggingService) {}
}
