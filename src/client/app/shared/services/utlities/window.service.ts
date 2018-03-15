import { Inject, Injectable, InjectionToken } from '@angular/core'

export const WINDOW = new InjectionToken<Window>('cfg.window')

export interface IWindowService {
  window<T>(): Window & T
}

@Injectable()
export class WindowService implements IWindowService {
  constructor(@Inject(WINDOW) private _window: Window) {}

  public window<T>(): Window & T {
    return this._window as Window & T
  }
}
