import { Directive, ElementRef, Input, OnInit } from '@angular/core'
import { SVGLoaderService } from './svg-loader.service'
import { makeStateKey, TransferState } from '@angular/platform-browser'

// tslint:disable:no-object-mutation
const insertSvg = (el: HTMLElement, svg: string) => {
  el.innerHTML = svg
}

export const SVG_TRANSFER_KEY = makeStateKey('cfg.ts.svg')

@Directive({
  selector: '[pmSvg]'
})
export class SvgDirective implements OnInit {
  @Input() readonly pmSvg: string

  constructor(
    private el: ElementRef,
    private ts: TransferState,
    private svgLoader: SVGLoaderService
  ) {}

  ngOnInit() {
    const svgCache = this.ts.get(makeStateKey(SVG_TRANSFER_KEY), {} as any)
    const loadedFromServer = svgCache[this.pmSvg]

    if (loadedFromServer) {
      insertSvg(this.el.nativeElement, loadedFromServer)
    } else {
      this.svgLoader
        .load(this.pmSvg)
        .take(1)
        .subscribe(svg => insertSvg(this.el.nativeElement, svg))
    }
  }
}
