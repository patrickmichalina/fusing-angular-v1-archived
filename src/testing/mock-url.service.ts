import { Injectable } from '@angular/core'

@Injectable()
export class MockUrlService {
  public decode(url: string): string {
    return url
  }

  public getHost(url: string) {
    return ''
  }

  public getComponents(url: string) {
    return ''
  }
}
