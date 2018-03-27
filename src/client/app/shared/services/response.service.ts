import { Injectable } from '@angular/core'

export interface IResponseService {
  getHeader(key: string): string
  setHeader(key: string, value: string): void
  setHeaders(dictionary: { readonly [key: string]: string }): void
  appendHeader(key: string, value: string, delimiter?: string): void
  setStatus(code: number, message?: string): void
  setNotFound(message?: string, code?: number): void
  setUnauthorized(message?: string, code?: number): void
  setError(message?: string, code?: number): void
}

@Injectable()
export class ResponseService implements IResponseService {
  setHeader(key: string, value: string): void {
    // noop
  }
  setHeaders(dictionary: { readonly [key: string]: string }): void {
    // noop
  }
  appendHeader(
    key: string,
    value: string,
    delimiter?: string | undefined
  ): void {
    // noop
  }
  setStatus(code: number, message?: string | undefined): void {
    // noop
  }
  setNotFound(message?: string | undefined, code?: number | undefined): void {
    // noop
  }
  setUnauthorized(
    message?: string | undefined,
    code?: number | undefined
  ): void {
    // noop
  }
  setError(message?: string | undefined, code?: number | undefined): void {
    // noop
  }

  getHeader(): string {
    return ''
  }
}
