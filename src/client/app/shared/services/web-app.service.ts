import { Injectable } from '@angular/core'
import { WindowService } from './utlities/window.service'

export interface IWebAppService {
  readonly isWebAppiOS: boolean
  readonly isWebAppChrome: boolean
  readonly isWebApp: boolean
}

@Injectable()
export class WebAppService implements IWebAppService {
  constructor(private ws: WindowService) {}

  private readonly win = this.ws.window()
  private readonly navigator = this.win.navigator
  private readonly hasMatchMedia = typeof this.win.matchMedia !== 'undefined'

  readonly isWebAppiOS = this.navigator && (this.navigator as any).standalone

  readonly isWebAppChrome = this.hasMatchMedia &&
    this.win.matchMedia('(display-mode: standalone)').matches

  readonly isWebApp = this.isWebAppiOS || this.isWebAppiOS
}
