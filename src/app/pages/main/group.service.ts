import {Injectable} from '@angular/core';
import {BaseService} from '../../base.service';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class GroupService extends BaseService {

  constructor(private hc: HttpClient) {
    super(hc);
  }

  /**
   * 获取所有订单团列表
   */
  listAllGroup() {
    return this.get('/group/list').map(res => res.data);
  }

  /**
   * 新建订单团
   * @param group
   */
  addGroup(group) {
    return this.post('/group/add', group).map(res => res.data);
  }

  /**
   * 获取订单团详细信息
   * @param groupId
   */
  getGroupDetail(groupId) {
    return this.get('/group/get?id=' + groupId).map(res => res.data);
  }
}