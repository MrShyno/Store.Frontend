import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthenticateService } from '../services/authenticate';
import { TokenStorageService } from '../services/token-storage/token-storage';

export const authenticateInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthenticateService);
  const tokenStorage = inject(TokenStorageService);
  const router = inject(Router);

  if (req.url.includes('Authentication/LoginWithPassword') ||
    req.url.includes('Authentication/RefreshToken') ||
    req.url.includes('Users/GetUserWithRolePermissions')) {
    return next(req);
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log(error);
      if (error.status !== 401) {
        return throwError(() => error);
      }

      if (req.url.includes('Authentication/RefreshToken')) {
        handleLogout(authService, tokenStorage, router);
        return throwError(() => error);
      }

      return handle401Error(req, next, authService, tokenStorage, router);
    })
  );
};

function handle401Error(
  request: HttpRequest<any>,
  next: HttpHandlerFn,
  authService: AuthenticateService,
  tokenStorage: TokenStorageService,
  router: Router
) {

  if (authService.getIsRefreshing()) {
    return authService.getRefreshTokenSubject().pipe(
      filter(token => token !== null),
      take(1),
      switchMap(() => {
        return next(request);
      })
    );
  }

  authService.setIsRefreshing(true);
  authService.getRefreshTokenSubject().next(null);

  const accessToken = tokenStorage.getAccessToken();
  const refreshToken = tokenStorage.getRefreshToken();

  if (!accessToken || !refreshToken) {
    handleLogout(authService, tokenStorage, router);
    return throwError(() => new Error('No tokens available'));
  }

  return authService.refreshToken(accessToken, refreshToken).pipe(
    switchMap((response: any) => {
      authService.setIsRefreshing(false);

      if (response.isSuccess && response.data) {
        const newAccessToken = response.data.accessToken || accessToken;
        const newRefreshToken = response.data.refreshToken || refreshToken;

        tokenStorage.setTokens(newAccessToken, newRefreshToken);

        authService.getRefreshTokenSubject().next(newAccessToken);

        return next(request);
      } else {
        handleLogout(authService, tokenStorage, router);
        return throwError(() => new Error('Token refresh failed'));
      }
    }),
    catchError((error) => {
      authService.setIsRefreshing(false);
      handleLogout(authService, tokenStorage, router);
      return throwError(() => error);
    })
  );
}

function handleLogout(
  authService: AuthenticateService,
  tokenStorage: TokenStorageService,
  router: Router
): void {
  authService.setIsRefreshing(false);
  authService.getRefreshTokenSubject().next(null);
  tokenStorage.clearTokens();
  authService.logout();
  router.navigate(['/auth/login']);
}
