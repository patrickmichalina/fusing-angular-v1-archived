import { Directive, ElementRef, Renderer2 } from '@angular/core'

@Directive({
  selector: 'a[pmExternalLink]'
})
export class ExternalLinkDirective {
  constructor(el: ElementRef, rd: Renderer2) {
    const anchor = el.nativeElement as HTMLAnchorElement
    rd.setAttribute(anchor, 'target', '_blank')
    rd.setAttribute(anchor, 'rel', 'noopener')
  }
}
