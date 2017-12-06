import {Injectable} from '@angular/core';
import {BaseService} from '../../base.service';
import {HttpClient} from '@angular/common/http';
import {Store} from '../../store/store';

@Injectable()
export class OrderService extends BaseService {

  constructor(private hc: HttpClient, private s: Store) {
    super(hc, s);
  }

  /**
   * 添加订单到订单团
   * @param order
   * @param groupId
   */
  addOrderToGroup(order) {
    return this.post('/order/create', order).map(res => res.data);
  }

  /**
   * 删除订单
   * @param orderId
   */
  deleteOrder(orderId) {
    return this.post('/order/remove', {
      id: orderId
    }).map(res => res.data);
  }
}
