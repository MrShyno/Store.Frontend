// authenticate-guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticateService } from '../services/authenticate';
import { map, catchError, of } from 'rxjs';

export const authenticateGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthenticateService);
    const router = inject(Router);

    if (authService.isLoggedIn()) {
        return true;
    }

    return authService.restoreSession().pipe(
        map(() => {
            return true;
        }),
        catchError(() => {
            router.navigate(['/auth/login'], {
                queryParams: { returnUrl: state.url }
            });
            return of(false);
        })
    );
};
