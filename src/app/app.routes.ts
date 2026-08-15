import { Routes } from '@angular/router';
import { authenticateGuard } from './core/guards/authenticate-guard';
import { hasPermissionGuard } from './core/guards/hasPermission/has-permission-guard';
import { AdminLayout } from './layout/admin-layout/admin-layout';

export const routes: Routes = [
  {
    path: 'auth',
    // AuthLayout will be used for all auth pages
    loadComponent: () => import('./layout/auth-layout/auth-layout')
      .then(m => m.AuthLayout),
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/Authenticate/login/login')
          .then(m => m.Login)
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  {
    path: 'dashboard',
    component: AdminLayout,
    canActivate: [authenticateGuard],
    children: [
      {
        path: 'index',
        loadComponent: () => import('./features/dashboard/index/index')
          .then(m => m.Index)
      },
      {
        path: 'users/list',
        canActivate: [hasPermissionGuard('usersGetAllUsers')],
        loadComponent: () => import('./features/dashboard/users/list/user-list')
          .then(m => m.UserList)
      },
      { path: '', redirectTo: 'index', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: '/dashboard/index', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard/index' }
];
