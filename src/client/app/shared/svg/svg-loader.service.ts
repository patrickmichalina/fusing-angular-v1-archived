import { Observable } from 'rxjs/Observable'
import { HttpClient } from '@angular/common/http'

export interface ISVGLoaderService {
  load(name: string): Observable<string>
}

export class SVGLoaderService implements ISVGLoaderService {
  constructor(private http: HttpClient) {}

  load(name: string): Observable<string> {
    return this.http.get(`./assets/svg/${name}.svg`, { responseType: 'text' })
  }
}
