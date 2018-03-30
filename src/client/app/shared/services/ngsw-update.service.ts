import { Inject, Injectable, InjectionToken } from '@angular/core'
import { SwUpdate } from '@angular/service-worker'
import { MatSnackBar } from '@angular/material'
import { Subject } from 'rxjs/Subject'
import { debounceTime, startWith, take } from 'rxjs/operators'
import { WindowService } from './utlities/window.service'
import { RXJS_DEFAULT_SCHEDULER } from '../../app.module'

export const NGSW_INTERVAL = new InjectionToken<number>('cfg.ngsw.interval')

@Injectable()
export class NgSwUpdateService {
  private readonly checkForUpdateSource = new Subject()

  constructor(
    private swUpdate: SwUpdate,
    private snackBar: MatSnackBar,
    private ws: WindowService,
    @Inject(RXJS_DEFAULT_SCHEDULER) private scheduler: any,
    @Inject(NGSW_INTERVAL) private interval: number
  ) {}

  public init() {
    this.swUpdate.isEnabled &&
      this.swUpdate.available.subscribe(event => this.reloadPrompt())
    this.swUpdate.isEnabled &&
      this.checkForUpdateSource
        .pipe(debounceTime(this.interval, this.scheduler), startWith(undefined))
        .subscribe(() => this.checkForUpdate())
  }

  private checkForUpdate() {
    this.swUpdate.isEnabled &&
      this.swUpdate.checkForUpdate().then(() => this.scheduleCheckForUpdate())
  }

  private scheduleCheckForUpdate() {
    this.checkForUpdateSource.next()
  }

  private reloadPrompt() {
    this.snackBar
      .open('App update available, press OK to reload', 'OK')
      .afterDismissed()
      .pipe(take(1))
      .subscribe(() => this.ws.window().location.reload())
  }
}
