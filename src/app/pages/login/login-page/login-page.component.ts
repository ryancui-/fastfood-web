import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Md5} from 'ts-md5/dist/md5';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {AuthService} from '../../../auth.service';

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
  loginForm: FormGroup;
  state = 'transparent';
  waitingResp = false;

  constructor(private router: Router,
              private authService: AuthService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    setTimeout(() => {
      this.state = 'show';
    }, 0);
  }

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
}
