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
import { User } from '../../../../models/Users/user';



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
    // set defaults
    this.selectedSearchField.set('firstName');

    this.selectedOrderField.set('createdAt');

    this.selectedOrderDirection.set('desc');

    this.loadItems();
  }

  protected override buildFilter(): string | undefined {

    const value = this.searchText().trim();

    if (!value) {
      return undefined;
    }
    
    return `${this.selectedSearchField()}=*${value}`;
  }
}
