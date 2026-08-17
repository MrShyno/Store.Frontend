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
import { User } from '../../../../models/Users/user';
import { Permission } from '../../../../shared/components/permission/permission';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../../core/services/Users/user-service';
import { ToastService } from '../../../../core/services/toast/toast';



@Component({
  selector: 'app-user-list',

  standalone: true,

  imports: [
    DataList,
    DatePipe,
    Permission,
    RouterLink
  ],

  templateUrl: './user-list.html',

  styleUrl: './user-list.css'
})
export class UserList
  extends BaseList<User>
  implements OnInit {

  private readonly httpUserService = inject(UserService);

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
    return 'admin/Users/GetAllUsers';
  }

  ngOnInit(): void {

    this.selectedSearchField.set('firstName');

    this.selectedOrderField.set('createdAt');

    this.selectedOrderDirection.set('desc');

    this.loadItems();
  }

  onDelete(userId: number): void {

    this.httpUserService
      .removeUser(userId)
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


  onDisable(userId: number): void {

    this.httpUserService
      .disableUser(userId)
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


  onEnable(userId: number): void {

    this.httpUserService
      .enableUser(userId)
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
