import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MainRoutingModule} from './main-routing.module';
import {GroupsPageComponent} from './groups-page/groups-page.component';
import {ProductsPageComponent} from './products-page/products-page.component';
import {NgZorroAntdModule} from 'ng-zorro-antd';

@NgModule({
  imports: [
    CommonModule,
    MainRoutingModule,
    NgZorroAntdModule
  ],
  declarations: [GroupsPageComponent, ProductsPageComponent]
})
export class MainModule {
}
