import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GroupsPageComponent} from './groups-page/groups-page.component';
import {ProductsPageComponent} from './products-page/products-page.component';
import {NeedLoginGuard} from '../../need-login.guard';
import {MainPageComponent} from './main-page/main-page.component';
import {NeedAdminGuard} from '../../need-admin.guard';

const routes: Routes = [{
  path: '',
  component: MainPageComponent,
  children: [{
    path: '',
    redirectTo: 'groups'
  }, {
    path: 'groups',
    component: GroupsPageComponent,
    canActivate: [NeedLoginGuard]
  }, {
    path: 'products',
    component: ProductsPageComponent,
    canActivate: [NeedLoginGuard, NeedAdminGuard]
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule {
}
