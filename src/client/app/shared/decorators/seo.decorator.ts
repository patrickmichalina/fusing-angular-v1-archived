import { AppModule } from '../../app.module'
import { Meta, Title } from '@angular/platform-browser'

interface ISEO {
  readonly title?: string
  readonly description?: string
}

// tslint:disable:no-object-mutation
// tslint:disable:readonly-array
// tslint:disable:no-invalid-this
export function SEO(obj: ISEO = {}): ClassDecorator {
  return AppModule.injector
    ? (constructor: any) => {
        const ts = AppModule.injector.get(Title)
        const ms = AppModule.injector.get(Meta)
        const ngOnInit = constructor.prototype.ngOnInit
        const ngOnDestroy = constructor.prototype.ngOnDestroy

        constructor.prototype.ngOnInit = (...args: any[]) => {
          obj.title && ts.setTitle(obj.title)
          obj.description &&
            ms.updateTag({
              name: 'description',
              content: obj.description
            })
          ngOnInit && ngOnInit.apply(this, args)
        }

        constructor.prototype.ngOnDestroy = (...args: any[]) => {
          ts.setTitle('')
          ms.removeTag('name="description"')
          ngOnDestroy && ngOnDestroy.apply(this, args)
        }
      }
    : () => undefined
}
