import {
  Component,
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


interface User {

  id: number;

  firstName: string;

  lastName: string;

  phone: string;

  email: string;

  disabled: boolean;

  nationalCode: string | null;

  createdAt: string;
}


@Component({
  selector: 'app-user-list',

  standalone: true,

  imports: [
    DataList,
    DatePipe
  ],

  templateUrl: './user-list.html',

  styleUrl: './user-list.css'
})
export class UserList
  extends BaseList<User>
  implements OnInit {


  // =========================================================
  // Search Fields
  // =========================================================

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
      label: 'ایمیل',
      value: 'email'
    }

  ];


  // =========================================================
  // Order Fields
  // =========================================================

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

    {
      label: 'شماره موبایل',
      value: 'phone'
    },

    {
      label: 'ایمیل',
      value: 'email'
    }

  ];


  // =========================================================
  // API
  // =========================================================

  protected override getEndpoint(): string {
    return 'admin/Users/GetAllUsers';
  }


  // =========================================================
  // Init
  // =========================================================

  ngOnInit(): void {

    this.selectedSearchField.set('firstName');

    this.selectedOrderField.set('createdAt');

    this.selectedOrderDirection.set('desc');

    this.loadItems();
  }


  // =========================================================
  // Filter
  // =========================================================

  protected override buildFilter(): string | undefined {

    const value = this.searchText().trim();

    if (!value) {
      return undefined;
    }

    return `${this.selectedSearchField()}=*${value}`;
  }
}
