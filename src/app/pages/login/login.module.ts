import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {LoginRoutingModule} from './login-routing.module';
import {LoginPageComponent} from './login-page/login-page.component';
import {NgZorroAntdModule} from 'ng-zorro-antd';

@NgModule({
  imports: [
    CommonModule,
    LoginRoutingModule,
    NgZorroAntdModule
  ],
  declarations: [LoginPageComponent]
})
export class LoginModule {
}
