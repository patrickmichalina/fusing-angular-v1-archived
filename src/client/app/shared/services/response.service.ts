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
    // do nothing in SPA mode to reduce file size
  }
  setHeaders(dictionary: { readonly [key: string]: string }): void {
    // do nothing in SPA mode to reduce file size
  }
  appendHeader(
    key: string,
    value: string,
    delimiter?: string | undefined
  ): void {
    // do nothing in SPA mode to reduce file size
  }
  setStatus(code: number, message?: string | undefined): void {
    // do nothing in SPA mode to reduce file size
  }
  setNotFound(message?: string | undefined, code?: number | undefined): void {
    // do nothing in SPA mode to reduce file size
  }
  setUnauthorized(
    message?: string | undefined,
    code?: number | undefined
  ): void {
    // do nothing in SPA mode to reduce file size
  }
  setError(message?: string | undefined, code?: number | undefined): void {
    // do nothing in SPA mode to reduce file size
  }

  getHeader(): string {
    return ''
  }
}
