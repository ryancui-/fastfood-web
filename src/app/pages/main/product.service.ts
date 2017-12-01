import {Injectable} from '@angular/core';
import {BaseService} from '../../base.service';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class ProductService extends BaseService {

  constructor(private hc: HttpClient) {
    super(hc);
  }

  /**
   * 根据条件获取所有菜单列表
   * @param condition
   * @returns {Observable<Object>}
   */
  list(conditions) {
    return this.post('/product/listAll', conditions).map(res => res.data);
  }

  /**
   * 根据条件获取每天的菜单列表
   * @param confitions
   */
  listPerday(conditions) {
    return this.post('/product/list', conditions).map(res => res.data);
  }

  /**
   * 新增菜单
   * @param product
   */
  add(product) {
    return this.post('/product/create', product).map(res => res.data);
  }

  /**
   * 修改菜单
   * @param product
   * @returns {OperatorFunction<T, R>}
   */
  edit(product) {
    return this.post('/product/edit', product).map(res => res.data);
  }

  /**
   * 改变菜单状态
   * @param id
   * @param valid
   * @returns {OperatorFunction<T, R>}
   */
  changeStatus(id, valid) {
    return this.post('/product/status', {
      id, valid
    }).map(res => res.data);
  }

  /**
   * 增加菜单选项
   * @param productId
   * @param optionName
   */
  addOption(productId, optionName) {
    return this.post('/product/createOption', {
      productId, optionName
    }).map(res => res.data);
  }

  /**
   * 删除菜单选项
   * @param optionId
   */
  deleteOption(optionId) {
    return this.post('/product/deleteOption', {
      id: optionId
    }).map(res => res.data);
  }

}
