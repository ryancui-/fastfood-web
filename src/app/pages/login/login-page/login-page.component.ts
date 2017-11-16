import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Md5} from 'ts-md5/dist/md5';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {AuthService} from '../../../auth.service';
import {Observable} from 'rxjs/Observable';
import {NzNotificationService} from 'ng-zorro-antd';

@Component({
  selector: 'login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  animations: [
    trigger('loginFadeIn', [
      state('transparent', style({
        opacity: 0,
        transform: 'translateY(-40px)'
      })),
      state('show', style({
        opacity: 1,
        transform: 'translateY(0)'
      })),
      transition('transparent => show', animate('700ms ease-out'))
    ])
  ]
})
export class LoginPageComponent implements OnInit {
  tab = 'login';

  loginForm: FormGroup;
  registerForm: FormGroup;
  loginBoxState = 'transparent';
  registerBoxState = 'transparent';

  waitingResp = false;

  usernameInvalid = '';

  constructor(private router: Router,
              private authService: AuthService,
              private notificationService: NzNotificationService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required, this.checkUsername.bind(this)],
      password: ['', Validators.required],
      inviteCode: ['', Validators.required]
    });

    setTimeout(() => {
      this.loginBoxState = 'show';
    }, 0);
  }

  // 切换tab
  switchTab() {
    if (this.tab === 'login') {
      this.tab = 'register';
      setTimeout(() => {
        this.registerBoxState = 'show';
        this.loginBoxState = 'transparent';
      }, 0);
    } else {
      this.tab = 'login';
      setTimeout(() => {
        this.loginBoxState = 'show';
        this.registerBoxState = 'transparent';
      }, 0);
    }
  }

  // 登录
  login() {
    this.waitingResp = true;
    this.authService.login(this.loginForm.value.username, Md5.hashStr(this.loginForm.value.password))
      .subscribe(success => {
        this.waitingResp = false;
        if (success) {
          this.router.navigateByUrl('');
        }
      });
  }

  // 注册
  register() {
    const query = this.registerForm.value;
    query.password = Md5.hashStr(query.password);

    this.authService.register(query).subscribe((res: any) => {
      if (res.errno === 0) {
        this.notificationService.success('恭喜', `${query.username} 注册成功，请登录系统`);
        this.switchTab();
      } else {
        this.notificationService.error('Oops', res.errmsg);
      }
    });
  }

  // 检查用户名
  checkUsername(control: AbstractControl): Observable<ValidationErrors | null> {
    const username = control.value;

    return this.authService.checkUsername(username).map((res: any) => {
      switch (res.errno) {
        case 12000:
          return {error: true, has_admin: true};
        case 12001:
          return {error: true, has_one: true};
        default:
          return null;
      }
    });
  }
}
