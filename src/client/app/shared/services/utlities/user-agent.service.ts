import { REQUEST } from '@nguniversal/express-engine/tokens'
import { PlatformService } from '../platform.service'
import { Inject, Injectable } from '@angular/core'
import { UAParser } from 'ua-parser-js'
import { WindowService } from './window.service'
import { Request } from 'express'

export interface IUserAgentService {
  readonly userAgent: IUAParser.IResult
  readonly isiPhone: boolean
  readonly isiPad: boolean
  readonly isMobile: boolean
  readonly isTablet: boolean
  readonly isDesktop: boolean
  readonly isChrome: boolean
  readonly isFirefox: boolean
  readonly isSafari: boolean
  readonly isIE: boolean
  readonly isIE7: boolean
  readonly isIE8: boolean
  readonly isIE9: boolean
  readonly isIE10: boolean
  readonly isIE11: boolean
  readonly isWindows: boolean
  readonly isWindowsXP: boolean
  readonly isWindows7: boolean
  readonly isWindows8: boolean
  readonly isMac: boolean
  readonly isChromeOS: boolean
  readonly isiOS: boolean
  readonly isAndroid: boolean
}

@Injectable()
export class UserAgentService implements IUserAgentService {
  constructor(
    private platformService: PlatformService,
    @Inject(REQUEST) private req: Request,
    private ws: WindowService
  ) {}

  public get userAgent(): IUAParser.IResult {
    const ua = this.platformService.isBrowser
      ? new UAParser(this.ws.window().navigator.userAgent)
      : new UAParser(this.req.headers['user-agent'] as string | undefined)

    return ua.getResult()
  }

  get isiPhone(): boolean {
    return this.userAgent.device.type === 'iPhone'
  }

  get isiPad(): boolean {
    return this.userAgent.device.type === 'iPad'
  }

  get isMobile(): boolean {
    return this.userAgent.device.type === 'mobile'
  }

  get isTablet(): boolean {
    return this.userAgent.device.type === 'tablet'
  }

  get isDesktop(): boolean {
    return !this.isTablet && !this.isMobile
  }

  get isChrome(): boolean {
    return this.userAgent.browser.name === 'Chrome'
  }

  get isFirefox(): boolean {
    return this.userAgent.browser.name === 'Firefox'
  }

  get isSafari(): boolean {
    return this.userAgent.browser.name === 'Safari'
  }

  get isIE(): boolean {
    return this.userAgent.browser.name === 'IE'
  }

  get isIE7(): boolean {
    return this.isIE && this.userAgent.browser.major === '7'
  }

  get isIE8(): boolean {
    return this.isIE && this.userAgent.browser.major === '8'
  }

  get isIE9(): boolean {
    return this.isIE && this.userAgent.browser.major === '9'
  }

  get isIE10(): boolean {
    return this.isIE && this.userAgent.browser.major === '10'
  }

  get isIE11(): boolean {
    return this.isIE && this.userAgent.browser.major === '11'
  }

  get isWindows(): boolean {
    return this.userAgent.os.name === 'Windows'
  }

  get isWindowsXP(): boolean {
    return this.isWindows && this.userAgent.os.version === 'XP'
  }

  get isWindows7(): boolean {
    return this.isWindows && this.userAgent.os.version === '7'
  }

  get isWindows8(): boolean {
    return this.isWindows && this.userAgent.os.version === '8'
  }

  get isMac(): boolean {
    return this.userAgent.os.name === 'Mac OS X'
  }

  get isChromeOS(): boolean {
    return this.userAgent.os.name === 'Chromium OS'
  }

  get isiOS(): boolean {
    return this.userAgent.os.name === 'iOS'
  }

  get isAndroid(): boolean {
    return this.userAgent.os.name === 'Android'
  }
}
