import {Component} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import 'rxjs/add/operator/filter';
import {Store} from './store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private router: Router,
              private store: Store) {
    this.router.events.filter(e => {
      return e instanceof NavigationEnd;
    }).subscribe((e: NavigationEnd) => {
      this.store.url = e.url;
    });
  }
}
