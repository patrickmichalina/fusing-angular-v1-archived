import { Observable } from 'rxjs/Observable'
import { InjectionToken } from '@angular/core'

export interface IUserIdentity {
  readonly id: string
}

interface Dictionary {
  readonly [key: string]: any
}
export type StorageRetrievalTypes = string

export interface IStorageProvider {
  readonly valueChanges: Observable<Dictionary>
  get(key: string): StorageRetrievalTypes
  getAll(): Dictionary
  set(key: string, value: any): any
  remove(key: string): void
}

export type ExtendedUser<TUser> = IUserIdentity & TUser | undefined

export interface ConsumerTokenModel {
  readonly accessToken?: string
  readonly idToken?: string
  readonly expiresIn?: number
}

export type IUserHydrationFactory<TUser> = (
  decodedToken: Object
) => ExtendedUser<TUser>
export type IFetchTokenFactory = () => Observable<ConsumerTokenModel>
export type ITokenDecoderFactory = (
  token?: StorageRetrievalTypes
) => Object | undefined
export type ITokenValidatorFactory = (
  stringToken?: StorageRetrievalTypes,
  decodedToken?: Object
) => Object | undefined
export type IRemoveSessionFactory = (
  storage: IStorageProvider,
  idTokenStorageKey?: string,
  accessTokenStorageKey?: string,
  refreshTokenStorageKey?: string
) => void
export type ISetSessionFactory = (
  storage: IStorageProvider,
  idToken?: string,
  accessToken?: string,
  accessTokenExpiresIn?: number,
  refreshToken?: string,
  idTokenStorageKey?: string,
  accessTokenStorageKey?: string,
  expiresInStorageKey?: string,
  refreshTokenStorageKey?: string
) => void

export const AUTH_ID_TOKEN_STORAGE_KEY = new InjectionToken<string>(
  'cfg.auth.sto.id.tkn.key'
)
export const AUTH_ACCESS_TOKEN_STORAGE_KEY = new InjectionToken<string>(
  'cfg.auth.sto.access.tkn.key'
)
export const AUTH_ACCESS_TOKEN_EXPIRY_STORAGE_KEY = new InjectionToken<string>(
  'cfg.auth.sto.access.tkn.exp.key'
)
export const AUTH_REFRESH_TOKEN_STORAGE_KEY = new InjectionToken<string>(
  'cfg.auth.sto.fresh.key'
)
export const AUTH_SET_SESSION_FACTORY = new InjectionToken<ISetSessionFactory>(
  'cfg.auth.ses.set'
)
export const AUTH_REMOVE_SESSION_FACTORY = new InjectionToken<
  IRemoveSessionFactory
>('cfg.auth.ses.remove')
export const AUTH_TOKEN_FETCH_FACTORY = new InjectionToken<IFetchTokenFactory>(
  'cfg.auth.tkn.fetch'
)
export const AUTH_TOKEN_VALIDATOR_FACTORY = new InjectionToken<
  ITokenDecoderFactory
>('cfg.auth.tkn.validator')
export const AUTH_TOKEN_DECODER_FACTORY = new InjectionToken<
  ITokenDecoderFactory
>('cfg.auth.tkn.decoder')
export const AUTH_USER_HYDRATION_FACTORY = new InjectionToken<
  IUserHydrationFactory<IUserIdentity>
>('cfg.auth.usr.hydrator')
export const AUTH_USER_TOKEN_SCHEMA = new InjectionToken<
  IUserHydrationFactory<IUserIdentity>
>('cfg.auth.usr.hydrator')
export const AUTH_CALLBACK_FACTORY = new InjectionToken<any>('cfg.auth.cb')
