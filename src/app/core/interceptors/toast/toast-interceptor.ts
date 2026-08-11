import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { ToastService } from '../../services/toast/toast';

export const toastInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Don't show toast for 401 (handled by auth interceptor)
      if (error.status !== 401) {
        let message = 'An unexpected error occurred';

        if (error.error?.message) {
          message = error.error.message;
        } else if (error.error?.errors?.length > 0) {
          message = error.error.errors.join(', ');
        }

        switch (error.status) {
          case 400:
            toastService.error(message, 'خطای اعتبارسنجی');
            break;
          case 403:
            toastService.error('شما دسترسی لازم را ندارید', 'دسترسی غیرمجاز');
            break;
          case 404:
            toastService.warning('اطلاعات مورد نظر یافت نشد');
            break;
          case 500:
            toastService.error('خطای سرور رخ داده است', 'خطای سیستم');
            break;
          default:
            toastService.error(message);
        }
      }

      return throwError(() => error);
    })
  );
};
