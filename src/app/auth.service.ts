import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {NzNotificationService} from 'ng-zorro-antd';
import {BaseService} from './base.service';
import {Store} from './store/store';

@Injectable()
export class AuthService extends BaseService {

  constructor(private hc: HttpClient,
              private s: Store,
              private notificationService: NzNotificationService) {
    super(hc, s);
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
        this.store.user = res.data.userInfo;
        this.store.token = res.data.token;
        localStorage.setItem('token', res.data.token);
        return true;
      } else {
        this.notificationService.error('错误', res.errmsg);
        return false;
      }
    });
  }

  /**
   * 登出
   */
  logout(): Observable<boolean> {
    return Observable.create(observable => {
      this.store.user = {};
      this.store.token = '';
      localStorage.removeItem('token');
      observable.next(true);
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

  /**
   * 获取已登录用户信息
   */
  profile() {
    return this.get('/profile').do(({errno, data}) => {
      if (errno === 0) {
        // 更新本地的用户信息
        this.store.user = data;
      }
    });
  }

  /**
   * 修改用户信息
   * @param params
   */
  modifyProfile(params) {
    return this.post('/profile/modify', params).flatMap(() => {
      return this.profile();
    });
  }

  /**
   * 上传用户头像
   * @param file
   */
  uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);
    return this.post('/profile/uploadAvatar', formData).flatMap(() => {
      return this.profile();
    });
  }
}
