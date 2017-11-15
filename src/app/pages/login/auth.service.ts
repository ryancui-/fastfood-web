import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {NzMessageService} from 'ng-zorro-antd';

@Injectable()
export class AuthService {

  constructor(private httpClient: HttpClient,
              private msgService: NzMessageService) {
  }

  /**
   * 登录
   * @param username
   * @param password
   * @returns {Observable<T>}
   */
  login(username, password): Observable<boolean> {
    return this.httpClient.post('http://localhost:8360/fastfood/api/auth/login', {
      username, password
    }).map((res: any) => {
      console.log(res);
      if (res.errno === 0) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.userInfo));
        return true;
      } else {
        this.msgService.error(res.errmsg);
        return false;
      }
    });
  }

  /**
   * 登出
   */
  logout(): Observable<boolean> {
    return Observable.create(observable => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      observable.next(true);
    });
  }
}
