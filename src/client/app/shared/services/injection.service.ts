import { Observer } from 'rxjs/Observer'
import { Observable } from 'rxjs/Observable'
import { Inject, Injectable, Renderer2 } from '@angular/core'
import { sha1 } from 'object-hash'
import { DOCUMENT } from '@angular/common'
import { makeStateKey, TransferState } from '@angular/platform-browser'

export interface DOMInjectable {
  inHead: boolean
  element: string
  value?: string
  attributes?: { [key: string]: string | boolean }
}

const injectionKey = makeStateKey<string[]>('Settings.RawInjections')

@Injectable()
export class InjectionService {
  doc: HTMLDocument

  constructor( @Inject(DOCUMENT) doc: any, private ts: TransferState) {
    this.doc = doc
  }

  createElement<T extends HTMLElement>(renderer: Renderer2, injectable: DOMInjectable): T | undefined {
    if (!injectable || !injectable.element) return undefined
    const elm = renderer.createElement(injectable.element) as T
    const id = sha1(JSON.stringify(injectable))

    renderer.setProperty(elm, 'id', id)
    if (injectable.value) renderer.setValue(elm, injectable.value)

    Object.keys(injectable.attributes || {})
      .forEach(key => renderer.setAttribute(elm, key, (injectable.attributes || {})[key] as any))

    return elm
  }

  getElementStringForm(renderer: Renderer2, injectable: DOMInjectable | undefined) {
    if (!injectable) return ''
    const elm = this.createElement(renderer, injectable)
    return ((elm && elm.outerHTML) || '').replace('><', `>${injectable.value}<`)
  }

  inject<T extends HTMLElement = HTMLElement>(renderer: Renderer2, injectable: DOMInjectable): Observable<T | undefined> {
    return new Observable((observer: Observer<T | undefined>) => {
      const elm = this.createElement<T>(renderer, injectable)

      if (!elm || this.existing(elm)) {
        observer.next(undefined)
        observer.complete()
        return
      }

      if (!(elm as any).src && !(elm as any).href) {
        observer.next(elm)
        observer.complete()
      } else {
        renderer.listen(elm, 'load', (evt: Event) => {
          observer.next(elm)
          observer.complete()
        })

        renderer.listen(elm, 'error', (evt: Event) => {
          observer.error(`Could not load injectable ${this.getElementStringForm(renderer, injectable)}`)
          observer.complete()
        })
      }

      injectable.inHead
        ? renderer.appendChild(this.doc.head, elm)
        : renderer.appendChild(this.doc.body, elm)
    })
  }

  existing(elm: HTMLElement) {
    return this.doc.getElementById(elm.id)
  }

  injectCollection(renderer: Renderer2, injectables: DOMInjectable[]) {
    return Observable.forkJoin(injectables.map(injectable => this.inject(renderer, injectable)))
  }

  injectRaw(raw: string) {
    if (!raw) return
    const injected = this.ts.get(injectionKey, [])
    const alredyInjected = injected.find(a => a === sha1(raw))
    if (alredyInjected) return
    this.doc.head.innerHTML = this.doc.head.innerHTML + raw
    this.ts.set(injectionKey, [...injected, sha1(raw)])
  }
}
