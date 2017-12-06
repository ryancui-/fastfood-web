import {environment} from '../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Store} from './store/store';

export class BaseService {

  constructor(protected httpClient: HttpClient, protected store: Store) {
  }

  protected apiHost = environment.apiHost;

  get(url: string): Observable<any> {
    return this.httpClient.get(this.apiHost + url, {
      headers: new HttpHeaders({
        authorization: this.store.token
      })
    });
  }

  post(url: string, data: any): Observable<any> {
    return this.httpClient.post(this.apiHost + url, data, {
      headers: new HttpHeaders({
        authorization: this.store.token
      })
    });
  }
}
