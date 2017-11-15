import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [{
  path: '',
  loadChildren: 'app/pages/main/main.module#MainModule'
}, {
  path: 'login',
  loadChildren: 'app/pages/login/login.module#LoginModule'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
