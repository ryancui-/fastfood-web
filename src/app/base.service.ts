import {environment} from '../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

export class BaseService {

  constructor(protected httpClient: HttpClient) {
  }

  protected apiHost = environment.apiHost;

  get(url: string): Observable<any> {
    return this.httpClient.get(this.apiHost + url, {
      headers: new HttpHeaders({
        authorization: localStorage.getItem('token')
      })
    });
  }

  post(url: string, data: any): Observable<any> {
    return this.httpClient.post(this.apiHost + url, data, {
      headers: new HttpHeaders({
        authorization: localStorage.getItem('token')
      })
    });
  }
}
