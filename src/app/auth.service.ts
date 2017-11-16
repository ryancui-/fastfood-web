import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {NzMessageService} from 'ng-zorro-antd';
import {BaseService} from './base.service';

@Injectable()
export class AuthService extends BaseService {

  constructor(private hc: HttpClient,
              private msgService: NzMessageService) {
    super(hc);
  }

  /**
   * 登录
   * @param username
   * @param password
   * @returns {Observable<T>}
   */
  login(username, password): Observable<boolean> {
    return this.httpClient.post(this.apiHost + '/auth/login', {
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

  /**
   * 检查用户名是否合法
   * @param username
   */
  checkUsername(username: string) {
    return this.httpClient.post(this.apiHost + '/auth/checkUsername', {
      username
    });
  }

  /**
   * 注册新用户
   * @param username
   * @param password
   * @param inviteCode
   */
  register(query) {
    return this.httpClient.post(this.apiHost + '/auth/register', query);
  }
}
