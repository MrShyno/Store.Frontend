import { Login } from './features/Authenticate/login/login';
import { Routes } from '@angular/router';
import { authenticateGuard } from './core/guards/authenticate-guard';
import { AdminLayout } from './layout/admin-layout/admin-layout';
import { AuthLayout } from './layout/auth-layout/auth-layout';

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
        path: 'analytics',
        loadComponent: () => import('./features/dashboard/analytics/analytics')
          .then(m => m.Analytics)
      },
      { path: '', redirectTo: 'index', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: '/dashboard/index', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard/index' }
];
