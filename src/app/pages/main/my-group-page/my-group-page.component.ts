import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {NzMessageService, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {ActivatedRoute} from '@angular/router';
import {GroupService} from '../group.service';
import {Store} from '../../../store/store';
import Utils from '../../../utils';

@Component({
  selector: 'my-group-page',
  templateUrl: './my-group-page.component.html',
  styleUrls: ['./my-group-page.component.scss']
})
export class MyGroupPageComponent implements OnInit {

  // 1-我发起的；2-我参与的
  groupType = 1;

  total = 0;
  tableLoading = false;
  groups = [];
  page = 1;
  rows = 15;

  @ViewChild('addGroupDialog') addGroupDialog;
  addGroupDialogInst;

  groupAddForm;

  constructor(private formBuilder: FormBuilder,
              private msgService: NzMessageService,
              private activatedRoute: ActivatedRoute,
              private nzNotificationService: NzNotificationService,
              private modalService: NzModalService,
              private groupService: GroupService,
              public store: Store) {
  }

  ngOnInit() {
    this.groupAddForm = this.formBuilder.group({
      groupName: ['', Validators.required],
      dueTime: null
    });

    this.listOwnerGroups().subscribe();
  }

  listOwnerGroups() {
    this.tableLoading = true;
    return this.groupService.listOwnerGroup({
      page: this.page,
      rows: this.rows
    }).do(data => {
      this.tableLoading = false;
      this.groups = data.rows;
      this.groups.forEach(group => {
        group.totalPrice = group.orders.map(o => o.total_price).reduce((p, c) => p + c, 0);
      });
      this.total = data.total;
    });
  }

  listMemberGroups() {
    this.tableLoading = true;
    return this.groupService.listMemberGroup({
      page: this.page,
      rows: this.rows
    }).do(data => {
      this.tableLoading = false;
      this.groups = data.rows;
      this.groups.forEach(group => {
        group.totalPrice = group.orders.map(o => o.total_price).reduce((p, c) => p + c, 0);
      });
      this.total = data.total;
    });
  }

  openAddGroupDialog() {
    this.groupAddForm.patchValue({
      groupName: Utils.formatDate(new Date()) + ' 订饭',
      dueTime: new Date()
    });

    this.addGroupDialogInst = this.modalService.open({
      title: '新建订单团',
      content: this.addGroupDialog,
      showConfirmLoading: true,
      width: 400,
      onOk: () => {
        return this.addGroup().toPromise();
      }
    });
  }

  addGroup() {
    const params = this.groupAddForm.value;
    params.dueTime = Utils.formatDateTime(params.dueTime);
    return this.groupService.addGroup(this.groupAddForm.value).flatMap(() => {
      return this.listOwnerGroups();
    });
  }

  refreshGroupData(reset?: boolean) {
    if (reset) {
      this.page = 1;
    }

    this.groupType === 1 ?
      this.listOwnerGroups().subscribe() :
      this.listMemberGroups().subscribe();
  }

  switchGroupType(checked, type) {
    if (checked) {
      this.groupType = type;
      this.refreshGroupData(true);
    }
  }

  // 修改订单团状态
  changeGroupStatus(group, status) {
    if (group.status !== 1) {
      return;
    }

    this.groupService.changeStatus(group.id, status ? 2 : 3).subscribe(() => {
      this.nzNotificationService.success('成功', '修改成功');
      this.refreshGroupData(true);
    });
  }
}
