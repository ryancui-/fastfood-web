import {Component, OnInit} from '@angular/core';
import {ProductService} from '../product.service';
import {GroupService} from '../group.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import Utils from '../../../utils';
import {NzNotificationService} from 'ng-zorro-antd';
import {OrderService} from '../order.service';

import 'rxjs/add/operator/do';

@Component({
  selector: 'app-groups-page',
  templateUrl: './groups-page.component.html',
  styleUrls: ['./groups-page.component.scss']
})
export class GroupsPageComponent implements OnInit {

  // 侧边栏状态
  // 1 - 显示订单团列表
  // 2 - 添加团
  // 3 - 显示订单团详情
  sideBlockStatus = 1;

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
  dueTimers;
  groupLoading = false;

  // 创建订单团
  groupAddForm: FormGroup;

  // 选择订单团
  groupId;
  orders;

  constructor(private productService: ProductService,
              private orderService: OrderService,
              private formBuilder: FormBuilder,
              private nzNotificationService: NzNotificationService,
              private groupService: GroupService) {
  }

  ngOnInit() {
    this.groupAddForm = this.formBuilder.group({
      dueTime: [null, Validators.required],
      groupName: ['', Validators.required]
    });

    this.listTodayProduct('reload');

    this.listGroups().subscribe();
  }

  // 列出当天菜式
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

  // 列出所有团组
  listGroups() {
    this.groupLoading = true;
    return this.groupService.listAllGroup().do(data => {
      this.groupLoading = false;
      this.clearDueTimers();
      this.groups = data;
      this.initDueTimers();
    });
  }

  // 清空 timer
  clearDueTimers() {
    if (this.dueTimers && this.dueTimers.length) {
      this.dueTimers.forEach(timer => {
        clearInterval(timer);
      });
    }
  }

  // 重新初始化 timer
  initDueTimers() {
    this.dueTimers = [];
    this.groups.forEach(group => {
      const timer = setInterval(() => {
        const dueTime = new Date(group.due_time).getTime();
        const now = new Date().getTime();
        group.remainTime = dueTime - now;
      }, 1000);
      this.dueTimers.push(timer);
    });
  }

  // 格式化剩余时间
  formatRemainTime(remain) {
    if (remain === undefined) {
      return '还在算呢傻孩子';
    } else if (remain < 0) {
      return '已经截止啦';
    } else {
      const seconds = Math.floor(remain / 1000);
      if (seconds < 60) {
        return '还剩 ' + seconds + ' 秒';
      }
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) {
        return '还剩 ' + minutes + ' 分钟 ' + (seconds - minutes * 60) + ' 秒';
      }
      const hours = Math.floor(minutes / 60);
      if (hours < 24) {
        return '还剩 ' + hours + ' 小时 ' + minutes % 60 + ' 分钟 ' + (seconds - hours * 3600 - minutes % 60 * 60) + ' 秒';
      }
      return '还有很久不要慌';
    }
  }

  // 选择某个订单团
  selectGroup(groupId) {
    if (this.sideBlockStatus === 1) {
      this.groupId = groupId;
      this.orders = this.initOrders(this.groups.find(group => group.id === groupId).orders);
      console.log(this.orders);
      this.sideBlockStatus = 3;
    }
  }

  // 跳转到创建订单团状态
  openAddGroup() {
    const today = new Date();
    this.groupAddForm.patchValue({
      dueTime: today,
      groupName: today.getDate() + ' 新团'
    });

    this.sideBlockStatus = 2;
  }

  // 取消创建订单团
  cancelAddGroup() {
    this.groupAddForm.reset();
    this.sideBlockStatus = 1;
  }

  // 退出特定订单团
  exitGroup() {
    this.groupId = null;
    this.sideBlockStatus = 1;
  }

  // 创建订单团
  addGroup() {
    console.log(this.groupAddForm.value);
    const params = this.groupAddForm.value;
    params.dueTime = Utils.formatDateTime(params.dueTime);
    this.groupService.addGroup(params).subscribe(data => {
      this.listGroups().subscribe(() => {
        this.sideBlockStatus = 1;
      });
    });
  }

  // 添加订单
  addOrder(product) {
    if (!this.groupId) {
      this.nzNotificationService.warning('提示', '先选一个团才能继续点');
      return;
    }

    const params = {
      groupId: this.groupId,
      productId: product.id,
      quantity: 1
    };

    this.orderService.addOrderToGroup(params).subscribe(data => {
      console.log(data);

      this.listGroups().subscribe(() => {
        this.orders = this.initOrders(this.groups.find(group => group.id === this.groupId).orders);
      });
    });
  }

  // 删除订单
  removeOrder(orderId) {
    console.log(orderId);
  }

  // 转换订单表，按 user 归类
  initOrders(orders) {
    const result = [];
    orders.forEach(order => {
      let obj = result.find(r => r.user.id === order.user_id);
      if (!obj) {
        obj = {
          user: order.user,
          rows: []
        };
        result.push(obj);
      }

      obj.rows.push(order);
    });

    // 计算每个人的总价
    for (let i = 0; i < result.length; i++) {
      const rows = result[i].rows;
      result[i].totalPrice = rows.map(r => r.total_price).reduce((p, c) => p + c, 0);
    }

    return result;
  }
}
