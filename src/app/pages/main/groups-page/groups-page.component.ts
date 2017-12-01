import {Component, OnInit} from '@angular/core';
import {ProductService} from '../product.service';
import {GroupService} from '../group.service';

@Component({
  selector: 'app-groups-page',
  templateUrl: './groups-page.component.html',
  styleUrls: ['./groups-page.component.scss']
})
export class GroupsPageComponent implements OnInit {

  // 菜单表格
  products = [];
  total = 0;
  page = 1;
  tableLoading = false;
  condition: any = {};
  categoryOptions = [
    '每旬菜式', '明炉烧味', '天天靓汤'
  ];

  // 订单团
  groups;
  groupLoading = false;

  constructor(private productService: ProductService,
              private groupService: GroupService) {
  }

  ngOnInit() {
    this.listTodayProduct('reload');

    this.listGroups();
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

  listGroups() {
    this.groupLoading = true;
    this.groupService.listAllGroup().subscribe(data => {
      this.groupLoading = false;
      this.groups = data;
    });
  }

  // 选择某个订单团
  selectGroup(groupId) {
    console.log(groupId);
  }
}
