import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticateService } from '../../services/authenticate';
import { ToastService } from '../../services/toast/toast';

export function hasPermissionGuard(permission: string): CanActivateFn {
  return () => {
    const authService = inject(AuthenticateService);
    const router = inject(Router);
    const toastService = inject(ToastService);

    if (authService.hasPermission(permission)) {
      return true;
    }

    toastService.warning('شما دسترسی لازم را ندارید', 'دسترسی محدود');
    router.navigate(['/dashboard/index']);
    return false;
  };
}
