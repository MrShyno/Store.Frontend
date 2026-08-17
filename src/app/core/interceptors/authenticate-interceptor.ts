import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthenticateService } from '../services/authenticate';
import { HttpService } from '../services/http';

export const authenticateInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthenticateService);
  const router = inject(Router);
  const http = inject(HttpService);

  if (req.url.includes('Authentication/RefreshToken')) {
    return next(req);
  }

  return next(req).pipe(
    catchError((error) => {
      if (error.status !== 401) {
        return throwError(() => error);
      }

      return http.post('admin/Authentication/RefreshToken', {}).pipe(
        switchMap(() => {
          return next(req);
        }),
        catchError((refreshError) => {
          authService.logout();
          router.navigate(['/auth/login']);
          return throwError(() => refreshError);
        })
      );
    })
  );
};
