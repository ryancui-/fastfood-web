import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {NeedLoginGuard} from './need-login.guard';
import {Store} from './store/store';
import {HttpClientModule} from '@angular/common/http';
import {AuthService} from './auth.service';
import {NeedAdminGuard} from './need-admin.guard';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgZorroAntdModule.forRoot()
  ],
  providers: [
    NeedLoginGuard,
    NeedAdminGuard,
    Store,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
