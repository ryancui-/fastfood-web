import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {Store} from './store';

@Injectable()
export class NeedLoginGuard implements CanActivate {

  constructor(public store: Store, private router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // 检查 localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // 设置全局变量
      this.store.user = JSON.parse(localStorage.getItem('user'));
      return true;
    } else {
      this.router.navigateByUrl('login');
      return false;
    }
  }
}
