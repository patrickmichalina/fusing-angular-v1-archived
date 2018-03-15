import { Observer } from 'rxjs/Observer'
import { Observable } from 'rxjs/Observable'
import { Inject, Injectable, RendererFactory2 } from '@angular/core'
import { sha1 } from 'object-hash'
import { DOCUMENT } from '@angular/common'

export interface DOMInjectable {
  readonly inHead: boolean
  readonly element: string
  readonly value?: string
  readonly attributes?: { readonly [key: string]: string | boolean }
}

@Injectable()
export class InjectionService {
  // tslint:disable-next-line:no-null-keyword
  private readonly renderer = this.rdf.createRenderer(null, null)
  constructor(
    @Inject(DOCUMENT) private doc: HTMLDocument,
    private rdf: RendererFactory2
  ) {}

  createElement<T extends HTMLElement>(
    injectable: DOMInjectable
  ): T | undefined {
    if (!injectable || !injectable.element) return undefined
    const elm = this.renderer.createElement(injectable.element) as T
    const id = sha1(JSON.stringify(injectable))

    this.renderer.setProperty(elm, 'id', id)
    if (injectable.value) this.renderer.setValue(elm, injectable.value)

    Object.keys(injectable.attributes || {}).forEach(key =>
      this.renderer.setAttribute(elm, key, (injectable.attributes || {})[
        key
      ] as any)
    )

    return elm
  }

  getElementStringForm(injectable: DOMInjectable | undefined) {
    if (!injectable) return ''
    const elm = this.createElement(injectable)
    return ((elm && elm.outerHTML) || '').replace('><', `>${injectable.value}<`)
  }

  inject<T extends HTMLElement = HTMLElement>(
    injectable: DOMInjectable
  ): Observable<T | undefined> {
    return new Observable((observer: Observer<T | undefined>) => {
      const elm = this.createElement<T>(injectable)

      if (!elm || this.existing(elm)) {
        observer.next(undefined)
        observer.complete()
        return
      }

      if (!(elm as any).src && !(elm as any).href) {
        observer.next(elm)
        observer.complete()
      } else {
        this.renderer.listen(elm, 'load', (evt: Event) => {
          observer.next(elm)
          observer.complete()
        })

        this.renderer.listen(elm, 'error', (evt: Event) => {
          observer.error(
            `Could not load injectable ${this.getElementStringForm(injectable)}`
          )
          observer.complete()
        })
      }

      injectable.inHead
        ? this.renderer.appendChild(this.doc.head, elm)
        : this.renderer.appendChild(this.doc.body, elm)
    })
  }

  existing(elm: HTMLElement) {
    return this.doc.getElementById(elm.id)
  }

  injectCollection(injectables: ReadonlyArray<DOMInjectable>) {
    return Observable.forkJoin(
      injectables.map(injectable => this.inject(injectable))
    )
  }
}
