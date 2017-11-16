import {Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {NzInputDirectiveComponent, NzMessageService, NzModalService} from 'ng-zorro-antd';
import {ProductService} from '../product.service';

@Component({
  selector: 'app-products-page',
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.scss']
})
export class ProductsPageComponent implements OnInit {

  productForm: FormGroup;

  @ViewChild('product_dialog')
  productDialogRef;

  productDialog;

  categoryOptions = [
    '每旬菜式', '明炉烧味', '天天靓汤'
  ];

  tableLoading = false;
  condition: any = {};
  products = [];
  page = 1;
  total = 0;

  @ViewChildren('option_input') input: QueryList<NzInputDirectiveComponent>;
  inputVisible;
  optionValue;

  isSaving = false;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private productService: ProductService,
              private msgService: NzMessageService,
              private dialogService: NzModalService) {
  }

  ngOnInit() {
    this.condition = {
      category: ''
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

    this.listProduct('reload');
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
      onOk: () => {
        this.saveProduct(!oldProduct);
      },
    });
  }

  // 保存菜单
  saveProduct(newProduct: boolean) {
    const product = this.productForm.value;
    product.spicy = product.spicy ? 1 : 0;
    console.log(product);

    if (newProduct) {
      this.isSaving = true;
      this.productService.add(product).subscribe(data => {
        this.isSaving = false;
        this.msgService.success('新增成功');
        this.listProduct('refresh');
        this.productDialog.destroy();
      });
    } else {
      this.isSaving = true;
      this.productService.edit(product).subscribe(data => {
        this.isSaving = false;
        this.msgService.success('修改成功');
        this.listProduct('refresh');
        this.productDialog.destroy();
      });
    }
  }

  // 改变状态
  confirmChangeStatus(oldProduct) {
    this.productService.changeStatus(oldProduct.id, oldProduct.valid ? 0 : 1)
      .subscribe(data => {
        this.msgService.success(oldProduct.valid ? '下架成功' : '上架成功');
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
