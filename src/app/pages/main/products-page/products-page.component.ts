import {Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {NzInputDirectiveComponent, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {ProductService} from '../product.service';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-products-page',
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.scss']
})
export class ProductsPageComponent implements OnInit, OnDestroy {

  productForm: FormGroup;

  @ViewChild('product_dialog')
  productDialogRef;

  productDialog;

  // 筛选类别
  categoryOptions = [];

  // 新建菜单类别，固定在前端
  categoryNewOptions = [
    '每旬菜式',
    '热销菜式',
    '明炉烧味',
    '滋补炖品',
    '天天靓汤',
    '港式粉面',
    '冷热饮品',
    '原盅蒸饭'
  ];

  searchKeyUp = new Subject<any>();
  keyUpSubscription;
  inputLock = false;

  tableLoading = false;
  condition: any = {};
  products = [];
  page = 1;
  total = 0;

  @ViewChildren('option_input') input: QueryList<NzInputDirectiveComponent>;
  inputVisible;
  optionValue;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private productService: ProductService,
              private notificationService: NzNotificationService,
              private dialogService: NzModalService) {
  }

  ngOnInit() {
    this.condition = {
      category: '',
      valid: null
    };

    this.productForm = this.formBuilder.group({
      id: '',
      name: ['', Validators.required],
      category: '',
      price: [null, Validators.required],
      part_of_month: 0,
      day_of_week: 0,
      spicy: 0,
    });

    this.productService.listCategories().subscribe(data => {
      this.categoryOptions = data;
    });

    this.listProduct('reload');

    this.keyUpSubscription = this.searchKeyUp
      .map(event => event.target.value)
      .debounceTime(800)
      .distinctUntilChanged()
      .subscribe(_ => {
        if (!this.inputLock) {
          this.listProduct('reload');
        }
      });
  }

  ngOnDestroy() {
    this.keyUpSubscription.unsubscribe();
  }

  listProduct(operation) {
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
    if (this.condition.valid !== null) {
      query.valid = this.condition.valid;
    }
    if (this.condition.q) {
      query.q = this.condition.q;
    }

    this.tableLoading = true;
    this.productService.list(query).subscribe(data => {
      this.tableLoading = false;
      this.total = data.total;
      this.products = data.rows;

      this.inputVisible = new Array(data.rows.length).fill(false);
      this.optionValue = new Array(data.rows.length).fill('');
    });
  }

  // 打开菜单对话框
  openDialog(oldProduct) {
    if (oldProduct) {
      this.productForm.patchValue(oldProduct);
      this.productForm.get('name').disable();
    } else {
      this.productForm.reset();
      this.productForm.patchValue({
        part_of_month: 0,
        day_of_week: 0,
        spicy: 0,
      });
      this.productForm.get('name').enable();
    }

    this.productDialog = this.dialogService.open({
      title: !oldProduct ? '新增菜单' : '修改菜单',
      content: this.productDialogRef,
      showConfirmLoading: true,
      onOk: () => {
        return this.saveProduct(!oldProduct).toPromise();
      },
    });
  }

  // 保存菜单
  saveProduct(newProduct: boolean): Observable<boolean> {
    const product = this.productForm.value;
    product.spicy = product.spicy ? 1 : 0;
    console.log(product);

    if (newProduct) {
      return this.productService.add(product).map(data => {
        this.notificationService.success('成功', '新增成功');
        this.listProduct('refresh');
        this.productDialog.destroy();
        return true;
      });
    } else {
      return this.productService.edit(product).map(data => {
        this.notificationService.success('成功', '修改成功');
        this.listProduct('refresh');
        this.productDialog.destroy();
        return true;
      });
    }
  }

  // 改变状态
  confirmChangeStatus(oldProduct) {
    this.productService.changeStatus(oldProduct.id, oldProduct.valid ? 0 : 1)
      .subscribe(data => {
        this.notificationService.success('成功', oldProduct.valid ? '下架成功' : '上架成功');
        this.listProduct('refresh');
      });
  }

  deleteOptions(option) {
    console.log(option);
    this.productService.deleteOption(option.id).subscribe(data => {
      this.listProduct('refresh');
    });
  }

  showInput(i): void {
    this.inputVisible[i] = true;
    setTimeout(() => {
      this.input.toArray()[i].nativeElement.focus();
    }, 10);
  }

  handleInputConfirm(product, i): void {
    if (this.optionValue[i]) {
      // 新增选项
      this.productService.addOption(product.id, this.optionValue[i])
        .subscribe(data => {
          this.listProduct('refresh');
        });
    }
    this.optionValue[i] = '';
    this.inputVisible[i] = false;
  }
}
