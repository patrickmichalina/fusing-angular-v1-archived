import { NotFoundComponent } from '../../client/app/not-found/not-found.component'

export const STATIC_ROUTE_RESPONSE_MAP: {
  readonly [key: string]: { readonly [key: string]: any }
} = {
  [NotFoundComponent.name]: {
    // 'X-Example-Header': 'cool value here'
  }
}
