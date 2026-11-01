import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import {
  DatePipe
} from '@angular/common';

import {
  BaseList
} from '../../../../shared/components/data-list/base-list';

import {
  DataList,
  ListOption
} from '../../../../shared/components/data-list/data-list';
import { Category } from '../../../../models/Categories/category';
import { Permission } from '../../../../shared/components/permission/permission';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../../../core/services/Categories/category-service';
import { ToastService } from '../../../../core/services/Toast/toast';



@Component({
  selector: 'app-category-list',

  standalone: true,

  imports: [
    DataList,
    DatePipe,
    Permission,
    RouterLink
  ],

  templateUrl: './category-list.html',

  styleUrl: './category-list.css'
})
export class CategoryList
  extends BaseList<Category>
  implements OnInit {

  private readonly httpCategoryService = inject(CategoryService);

  private readonly toast = inject(ToastService);
  readonly searchFields: readonly ListOption[] = [

    {
      label: 'نام',
      value: 'firstName'
    },

    {
      label: 'نام خانوادگی',
      value: 'lastName'
    },

    {
      label: 'شماره موبایل',
      value: 'phone'
    },

    {
      label: 'کد ملی',
      value: 'nationalCode'
    }

  ];

  readonly orderFields: readonly ListOption[] = [

    {
      label: 'تاریخ ایجاد',
      value: 'createdAt'
    },

    {
      label: 'نام',
      value: 'firstName'
    },

    {
      label: 'نام خانوادگی',
      value: 'lastName'
    },

  ];

  protected override getEndpoint(): string {
    return 'admin/Categories/GetAllCategories';
  }

  ngOnInit(): void {

    this.selectedSearchField.set('firstName');

    this.selectedOrderField.set('createdAt');

    this.selectedOrderDirection.set('desc');

    this.loadItems();
  }

  onDelete(categoryId: number): void {

    this.httpCategoryService
      .removeCategory(categoryId)
      .subscribe({
        next: response => {

          if (response.isSuccess) {

            this.toast.success('کاربر حذف شد.');
            this.loadItems();
            return;
          }

          this.toast.error(
            response.message || 'حذف کاربر انجام نشد.'
          );
        },

        error: error => {

          console.error(error);
          this.toast.error('حذف کاربر با خطا مواجه شد.');
        }
      });
  }


  onDisable(categoryId: number): void {

    this.httpCategoryService
      .disableCategory(categoryId)
      .subscribe({
        next: response => {

          if (response.isSuccess) {
            this.toast.success('کاربر غیرفعال شد.');
            this.loadItems();
            return;
          }

          this.toast.error(
            response.message || 'غیرفعال کردن کاربر انجام نشد.'
          );
        },

        error: error => {
          console.error(error);
          this.toast.error(
            'غیرفعال کردن کاربر با خطا مواجه شد.'
          );
        }
      });
  }


  onEnable(categoryId: number): void {

    this.httpCategoryService
      .enableCategory(categoryId)
      .subscribe({
        next: response => {

          if (response.isSuccess) {
            this.toast.success('کاربر فعال شد.');
            this.loadItems();
            return;
          }

          this.toast.error(
            response.message || 'فعال کردن کاربر انجام نشد.'
          );
        },

        error: error => {
          console.error(error);
          this.toast.error('فعال کردن کاربر با خطا مواجه شد.');
        }
      });
  }

  protected override buildFilter(): string | undefined {

    const value = this.searchText().trim();

    if (!value) {
      return undefined;
    }

    return `${this.selectedSearchField()}=*${value}`;
  }
}
