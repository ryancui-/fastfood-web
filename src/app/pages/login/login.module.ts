import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {LoginRoutingModule} from './login-routing.module';
import {LoginPageComponent} from './login-page/login-page.component';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {ReactiveFormsModule} from '@angular/forms';
import {AuthService} from './auth.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoginRoutingModule,
    NgZorroAntdModule
  ],
  providers: [
    AuthService
  ],
  declarations: [LoginPageComponent]
})
export class LoginModule {
}
