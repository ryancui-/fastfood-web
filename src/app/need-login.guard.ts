import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {Store} from './store/store';
import {NzNotificationService} from 'ng-zorro-antd';
import {AuthService} from './auth.service';

@Injectable()
export class NeedLoginGuard implements CanActivate {

  constructor(public store: Store,
              private notificationService: NzNotificationService,
              private authService: AuthService,
              private router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // 检查 localStorage
    this.store.token = this.store.token || localStorage.getItem('token');
    if (this.store.token) {
      if (!this.store.user) {
        return this.authService.profile().map(({errno}) => {
          if (errno === 0) {
            return true;
          } else {
            this.store.token = '';
            localStorage.removeItem('token');
            this.notificationService.warning('Oops', '抱歉，出于某些原因，你必须要重新登录');
            this.router.navigateByUrl('login');
            return false;
          }
        });
      } else {
        return true;
      }
    } else {
      this.notificationService.warning('Oops', '你还没登录啊，哥');
      this.router.navigateByUrl('login');
      return false;
    }
  }
}
