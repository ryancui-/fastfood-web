import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {Store} from './store/store';
import {Location} from '@angular/common';

@Injectable()
export class NeedAdminGuard implements CanActivate {

  constructor(public store: Store,
              private router: Router,
              private location: Location) {
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.store.user.is_admin) {
      return true;
    } else {
      this.location.back();
      return false;
    }
  }
}
