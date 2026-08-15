import { SidebarMenuItem } from "../models/Sidebar/SidebarMenuItem";

export const sidebarMenu: SidebarMenuItem[] = [
  {
    title: 'داشبورد',
    icon: 'bx-home-circle',
    children: [
      {
        title: 'صفحه اصلی',
        route: 'index',
      },
      {
        title: 'تنظیمات',
        route: 'settings'
      }
    ]
  },

  {
    title: 'کاربران',
    icon: 'bx-user',
    children: [
      {
        title: 'لیست کاربران',
        route: 'users/list',
        permission: 'usersGetAllUsers'
      },
    ]
  },

  {
    title: 'نقش ها',
    icon: 'bx-folder-minus',
    children: [
      {
        title: 'لیست نقش ها',
        route: 'roles/list',
        permission: 'rolesGetAllRoles'
      }
    ]
  },
  {
    title: 'دسترسی ها',
    icon: 'bx-lock',
    children: [
      {
        title: 'لیست دسترسی ها',
        route: 'permissions/list',
        permission: 'rolesGetAllRoles'
      }
    ]
  }
];
