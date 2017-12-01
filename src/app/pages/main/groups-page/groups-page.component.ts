import {Component, OnInit} from '@angular/core';
import {ProductService} from '../product.service';

@Component({
  selector: 'app-groups-page',
  templateUrl: './groups-page.component.html',
  styleUrls: ['./groups-page.component.scss']
})
export class GroupsPageComponent implements OnInit {

  products = [];
  total = 0;
  page = 1;
  tableLoading = false;
  condition: any = {};
  categoryOptions = [
    '每旬菜式', '明炉烧味', '天天靓汤'
  ];

  constructor(private productService: ProductService) {
  }

  ngOnInit() {
    this.listTodayProduct('reload');
  }

  listTodayProduct(operation) {
    switch (operation) {
      case 'refresh':
        break;
      case 'reload':
        this.page = 1;
        break;
    }

    const query: any = {
      page: this.page
    };

    if (this.condition.category) {
      query.category = this.condition.category;
    }

    this.tableLoading = true;
    this.productService.listPerday(query).subscribe(data => {
      this.tableLoading = false;
      this.total = data.total;
      this.products = data.rows;
    });
  }
}
