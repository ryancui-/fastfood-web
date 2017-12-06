import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MainRoutingModule} from './main-routing.module';
import {GroupsPageComponent} from './groups-page/groups-page.component';
import {ProductsPageComponent} from './products-page/products-page.component';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {MainPageComponent} from './main-page/main-page.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ProductService} from './product.service';
import {GroupService} from './group.service';
import {OrderService} from './order.service';
import {CardMenuComponent} from './card-menu/card-menu.component';
import {Store} from '../../store/store';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MainRoutingModule,
    NgZorroAntdModule
  ],
  providers: [
    ProductService, GroupService, OrderService, Store
  ],
  declarations: [GroupsPageComponent, ProductsPageComponent, MainPageComponent, CardMenuComponent]
})
export class MainModule {
}
