import {Component, OnInit, ViewChild} from '@angular/core';
import {ProductService} from '../product.service';
import {GroupService} from '../group.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import Utils from '../../../utils';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {OrderService} from '../order.service';

import 'rxjs/add/operator/do';
import {Store} from '../../../store';

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
  categoryOptions = [];
  selectedProduct;

  // 订单团
  groups;
  dueTimers;
  groupLoading = false;
  groupType = 1;

  // 创建订单团
  groupAddForm: FormGroup;

  // 选择订单团
  groupId;
  orders;

  @ViewChild('order_dialog') orderDialog;
  orderDialogInst;

  // 添加订单对话框
  orderAddForm;

  constructor(private productService: ProductService,
              private orderService: OrderService,
              private formBuilder: FormBuilder,
              private nzNotificationService: NzNotificationService,
              private modalService: NzModalService,
              private groupService: GroupService,
              public store: Store) {
  }

  ngOnInit() {
    this.groupAddForm = this.formBuilder.group({
      dueTime: [null, Validators.required],
      groupName: ['', Validators.required]
    });

    this.orderAddForm = this.formBuilder.group({
      quantity: [null, Validators.required],
      remark: ''
    });

    this.productService.listCategories().subscribe(data => {
      this.categoryOptions = data;
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
    this.groups = [];
    return this.groupService.listAllGroup(this.groupType).do(data => {
      this.groupLoading = false;
      this.clearDueTimers();
      this.groups = data;

      for (let i = 0; i < this.groups.length; i++) {
        const orders = this.groups[i].orders;
        this.groups[i].totalPrice =
          orders.map(o => o.total_price).reduce((p, c) => p + c, 0);
      }

      this.initDueTimers();
    });
  }

  // 切换订单团类型
  switchGroups(checked, type) {
    if (checked) {
      this.groupType = type;
      this.listGroups().subscribe();
    }
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
      // 已过期或者状态不是已征集的 push null ，不需要定时
      if (!this.isGroupActive(group.id)) {
        this.dueTimers.push(null);
      } else if (this.isGroupExpired(group.id)) {
        group.remainTime = -1;
        this.dueTimers.push(null);
      } else {
        const timer = setInterval(() => {
          const dueTime = new Date(group.due_time).getTime();
          const now = new Date().getTime();
          group.remainTime = dueTime - now;
        }, 1000);
        this.dueTimers.push(timer);
      }
    });
  }

  // 格式化剩余时间
  formatRemainTime(remain) {
    if (remain === undefined) {
      return '';
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
    if (this.sideBlockStatus !== 3) {
      this.groupId = groupId;
      this.orders = this.initOrders(this.groups.find(group => group.id === groupId).orders);
      console.log(this.orders);
      this.sideBlockStatus = 3;

      // 不在征集中 tab 进入
      if (this.isGroupActive(groupId) && this.groupType !== 1) {
        this.switchGroups(true, 1);
      }
    }
  }

  // 跳转到创建订单团状态
  openAddGroup() {
    const today = new Date();
    this.groupAddForm.patchValue({
      dueTime: today,
      groupName: Utils.formatDate(today) + ' 订饭'
    });

    this.sideBlockStatus = 2;
  }

  // 取消创建订单团
  cancelAddGroup() {
    this.groupAddForm.reset();
    this.sideBlockStatus = 1;
  }

  disabledDate(current) {
    return current && current.getTime() < Date.now();
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
        this.selectGroup(data);
      });
    });
  }

  // 当前用户是否是订单团的发起人
  isGroupOnwer(groupId) {
    if (this.groups.length === 0 || !groupId) {
      return false;
    }
    return this.groups.find(g => g.id === groupId).composer_user_id === this.store.user.id;
  }

  // 订单团是否已过期
  isGroupExpired(groupId) {
    if (this.groups.length === 0 || !groupId) {
      return false;
    }
    return new Date().getTime() -
      new Date(this.groups.find(g => g.id === groupId).due_time).getTime() > 0;
  }

  // 订单团是否为征集中状态
  isGroupActive(groupId) {
    if (this.groups.length === 0 || !groupId) {
      return false;
    }
    return this.groups.find(g => g.id === groupId).status === 1;
  }

  // 改变团组状态
  changeGroupStatus(status) {
    this.groupService.changeStatus(this.groupId, status ? 3 : 2).subscribe(() => {
      this.nzNotificationService.success('成功', '修改成功');
      this.listGroups().subscribe(() => {
        this.groupId = null;
        this.sideBlockStatus = 1;
      });
    });
  }

  // 打开订单确认
  openOrderConfirm(product) {
    this.selectedProduct = product;
    this.orderAddForm.patchValue({
      quantity: 1,
      remark: ''
    });
    this.orderDialogInst = this.modalService.open({
      title: '确认点餐',
      content: this.orderDialog,
      width: 400,
      onOk: () => {
        this.addOrder();
      }
    });
  }

  // 添加订单
  addOrder() {
    const params = {
      groupId: this.groupId,
      productId: this.selectedProduct.id,
      quantity: this.orderAddForm.get('quantity').value,
      remark: this.orderAddForm.get('remark').value
    };

    this.orderService.addOrderToGroup(params).subscribe(() => {
      this.listGroups().subscribe(() => {
        this.orders = this.initOrders(this.groups.find(group => group.id === this.groupId).orders);
      });
    });
  }

  // 删除订单
  removeOrder(orderId) {
    this.orderService.deleteOrder(orderId).subscribe(() => {
      this.nzNotificationService.success('成功', '删除成功');
      this.listGroups().subscribe(() => {
        this.orders = this.initOrders(this.groups.find(group => group.id === this.groupId).orders);
      });
    });
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
