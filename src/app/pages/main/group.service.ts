import {Injectable} from '@angular/core';
import {BaseService} from '../../base.service';
import {HttpClient} from '@angular/common/http';
import {Store} from '../../store/store';

@Injectable()
export class GroupService extends BaseService {

  constructor(private hc: HttpClient, private s: Store) {
    super(hc, s);
  }

  /**
   * 获取所有征集中订单团列表
   */
  listActiveGroup() {
    return this.get('/group/listActive').map(res => res.data);
  }

  /**
   * 分页获取我发起的订单团列表
   * @param params
   * @returns {OperatorFunction<T, R>}
   */
  listOwnerGroup(params) {
    return this.post('/group/listOnwer', params).map(res => res.data);
  }

  /**
   * 分页获取我参与的订单团列表
   * @param params
   * @returns {OperatorFunction<T, R>}
   */
  listMemberGroup(params) {
    return this.post('/group/listMember', params).map(res => res.data);
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

  /**
   * 改变订单团状态
   * @param groupId
   * @param status
   * @returns {OperatorFunction<T, R>}
   */
  changeStatus(groupId, status) {
    return this.post('/group/status', {
      id: groupId, status
    }).map(res => res.data);
  }
}
