import { staticAppInjectorRef } from '../../app.module'
import { OgPageType, SEOImage, SEOService } from '../services/seo.service'

interface ISEOStatic {
  readonly title?: string
  readonly description?: string
  readonly pageType?: OgPageType
  readonly articleTags?: ReadonlyArray<string>
  readonly images?: ReadonlyArray<SEOImage>
}

// tslint:disable:no-object-mutation
// tslint:disable:readonly-array
// tslint:disable:no-invalid-this
export function SEO(obj: ISEOStatic = {}): ClassDecorator {
  const ref = staticAppInjectorRef()
  return !ref
    ? () => undefined
    : constructor => {
        const injector = ref.injector
        const seo = injector.get(SEOService)
        const ngOnInit = constructor.prototype.ngOnInit
        const ngOnDestroy = constructor.prototype.ngOnDestroy

        constructor.prototype.ngOnInit = (...args: any[]) => {
          seo.setTitle(obj.title)
          seo.setDescription(obj.description)
          seo.updateArticleTags(obj.articleTags)
          seo.updatePageType(obj.pageType)
          seo.updateImages(obj.images)
          ngOnInit && ngOnInit.apply(this, args)
        }

        constructor.prototype.ngOnDestroy = (...args: any[]) => {
          seo.removePageType()
          seo.removeTitle()
          seo.removeDescription()
          seo.removeArticleTags()
          seo.removeImages()
          ngOnDestroy && ngOnDestroy.apply(this, args)
        }
      }
}
