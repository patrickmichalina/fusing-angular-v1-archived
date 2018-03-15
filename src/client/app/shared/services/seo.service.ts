import { Inject, Injectable, RendererFactory2 } from '@angular/core'
import { Meta, Title } from '@angular/platform-browser'
import { DOCUMENT } from '@angular/common'

export interface SEONode {
  readonly title?: string
  readonly description?: string
  readonly img?: SEOImage
  readonly type?: string
  readonly url?: string
  readonly locale?: string
  readonly facebookAppId?: string
  readonly tags?: ReadonlyArray<string>
}

export interface SEOImage {
  readonly url?: string
  readonly alt?: string
  readonly type?: string
  readonly height?: number
  readonly width?: number
}

const createOgTag = (property: string, content: string) => {
  return {
    property: `og:${property}`,
    content
  }
}

const getOgTagRemoveQuery = (property: string) => {
  return `property="og:${property}"`
}

@Injectable()
export class SEOService {
  // tslint:disable-next-line:no-null-keyword
  private readonly rd = this.rdf.createRenderer(null, null)
  constructor(
    private title: Title,
    private meta: Meta,
    private rdf: RendererFactory2,
    @Inject(DOCUMENT) private doc: HTMLDocument
  ) {}

  removeOgTag(property: string) {
    this.meta.removeTag(getOgTagRemoveQuery(property))
  }

  setTitle(title?: string) {
    title && this.title.setTitle(title)
    title && this.meta.updateTag(createOgTag('title', title))
  }

  removeTitle() {
    this.title.setTitle('')
    this.removeOgTag('title')
  }

  setDescription(description?: string) {
    const name = 'description'
    description && this.meta.updateTag({ name, content: description })
    description && this.meta.updateTag(createOgTag(name, description))
  }

  removeDescription() {
    this.meta.removeTag('name="description"')
    this.removeOgTag('description')
  }

  updateArticleTags(tags: ReadonlyArray<string> = []) {
    this.removeArticleTags()
    tags.forEach(tag => this.meta.addTag(createOgTag('article:tag', tag)))
  }

  removeArticleTags() {
    this.meta.getTags('property="og:article:tag"').forEach(a => a.remove())
  }

  updateFacebookAppId(id: string) {
    this.meta.updateTag({ property: 'fb:app_id', content: id })
  }

  removeFacebookAppId() {
    this.meta.removeTag('property="fb:app_id"')
  }

  updatePageType(type: OgPageType = 'website') {
    this.updateOgTypeNamespace()
    this.meta.updateTag(createOgTag('type', type))
  }

  removePageType() {
    this.removeOgTypeNamespace()
    this.removeOgTag('type')
  }

  updateLocale(locale = 'en_US') {
    this.meta.updateTag(createOgTag('locale', locale))
  }

  updateUrl(url: string) {
    this.removeUrl()
    this.meta.updateTag(createOgTag('url', url))
  }

  removeUrl() {
    this.removeOgTag('url')
  }

  updateOgTypeNamespace() {
    this.rd.setAttribute(this.doc.head, 'prefix', 'og: http://ogp.me/ns#')
  }

  removeOgTypeNamespace() {
    this.rd.removeAttribute(this.doc.head, 'prefix')
  }

  updateImages(imgages: ReadonlyArray<SEOImage> = []) {
    imgages.forEach(image => {
      this.updateImage(image)
    })
  }

  removeImages() {
    this.meta.getTags('property^="og:image"').forEach(a => a.remove())
  }

  private updateImage(img: SEOImage) {
    img.url && this.meta.updateTag(createOgTag('image:url', img.url))
    img.type && this.meta.updateTag(createOgTag('image:type', img.type))
    img.alt && this.meta.updateTag(createOgTag('image:alt', img.alt))
    img.width &&
      this.meta.updateTag(createOgTag('image:width', img.width.toString()))
    img.height &&
      this.meta.updateTag(createOgTag('image:height', img.height.toString()))
  }
}

export type OgPageType =
  | 'website'
  | 'article'
  | 'book'
  | 'profile'
  | 'music.song'
  | 'music.album'
  | 'music.playlist'
  | 'music.radio_station'
  | 'video.movie'
  | 'video.episode'
  | 'video.tv_show'
  | 'video.other'
