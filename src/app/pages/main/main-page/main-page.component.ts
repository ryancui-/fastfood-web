import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../auth.service';
import {Router} from '@angular/router';
import {Store} from '../../../store/store';

@Component({
  selector: 'main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  constructor(private authService: AuthService,
              private router: Router,
              public store: Store) {
  }

  ngOnInit() {
  }

  logout() {
    this.authService.logout().subscribe(success => {
      if (success) {
        this.router.navigateByUrl('login');
      }
    });
  }
}
