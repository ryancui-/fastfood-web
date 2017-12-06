import {Injectable} from '@angular/core';

@Injectable()
export class Store {
  categoryOptions = [
    '每旬菜式',
    '热销菜式',
    '明炉烧味',
    '滋补炖品',
    '天天靓汤',
    '港式粉面',
    '冷热饮品',
    '原盅蒸饭'
  ];

  user;
  token;

  url;
}
