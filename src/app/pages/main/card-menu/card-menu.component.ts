import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Store} from '../../../store/store';

@Component({
  selector: 'card-menu',
  templateUrl: './card-menu.component.html',
  styleUrls: ['./card-menu.component.scss']
})
export class CardMenuComponent implements OnInit {

  @Input() data;
  @Output() productSelect = new EventEmitter();

  constructor(public store: Store) {
  }

  ngOnInit() {
  }

  filterByCategory(category) {
    return this.data.filter(m => m.category === category);
  }

  selectMenu(menu) {
    this.productSelect.emit(menu);
  }
}
