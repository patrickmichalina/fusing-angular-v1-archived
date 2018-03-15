import { AppModule } from '../../app.module'
import { DOMInjectable, InjectionService } from '../services/injection.service'

// tslint:disable:no-object-mutation
// tslint:disable:readonly-array
// tslint:disable:no-invalid-this
export function Injections(injections: DOMInjectable[] = []): ClassDecorator {
  return AppModule.injector
    ? (constructor: any) => {
        const is = AppModule.injector.get(InjectionService)
        const ngOnInit = constructor.prototype.ngOnInit
        const ngOnDestroy = constructor.prototype.ngOnDestroy
        let elements: HTMLElement[] = []

        constructor.prototype.ngOnInit = (...args: any[]) => {
          is
            .injectCollection(injections)
            .take(1)
            .do(
              el =>
                (elements = el.filter(a => a !== undefined) as HTMLElement[])
            )
            .subscribe(() => ngOnInit && ngOnInit.apply(this, args))
        }

        constructor.prototype.ngOnDestroy = (...args: any[]) => {
          elements.forEach(a => a.remove())
          ngOnDestroy && ngOnDestroy.apply(this, args)
        }
      }
    : () => undefined
}
