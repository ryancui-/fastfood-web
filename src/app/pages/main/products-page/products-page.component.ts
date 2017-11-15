import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {ProductService} from '../product.service';

@Component({
  selector: 'app-products-page',
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.scss']
})
export class ProductsPageComponent implements OnInit {

  productForm;

  @ViewChild('product_dialog')
  productDialogRef;

  productDialog;

  categoryOptions = [
    '每旬菜式', '明炉烧味', '天天靓汤'
  ];

  products = [];

  isSaving = false;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private productService: ProductService,
              private msgService: NzMessageService,
              private dialogService: NzModalService) {
  }

  ngOnInit() {
    this.productForm = this.formBuilder.group({
      id: '',
      name: ['', Validators.required],
      category: '',
      price: [null, Validators.required],
      part_of_month: 0,
      day_of_week: 0,
      spicy: 0,
    });

    this.listProduct();
  }

  listProduct(condition?) {
    this.productService.list(condition).subscribe(data => {
      this.products = data;
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
    console.log(product);

    // if (newProduct) {
    //   this.isSaving = true;
    //   this.productService.add(product).subscribe(data => {
    //     this.isSaving = false;
    //     this.msgService.success('新增成功');
    //     this.productDialog.destroy();
    //   });
    // } else {
    //   this.isSaving = true;
    //   this.productService.edit(product).subscribe(data => {
    //     this.isSaving = false;
    //     this.msgService.success('修改成功');
    //     this.productDialog.destroy();
    //   });
    // }
  }
}
