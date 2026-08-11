import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideToastr } from 'ngx-toastr';
import { provideRouter } from '@angular/router';
import {provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { routes } from './app.routes';
import { authenticateInterceptor } from './core/interceptors/authenticate-interceptor';
import { toastInterceptor } from './core/interceptors/toast/toast-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
     provideHttpClient(
      withFetch(),
      withInterceptors([
        authenticateInterceptor,
        toastInterceptor
      ])
    ),
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressBar: true,
      closeButton: true,
      newestOnTop: true,
      countDuplicates: true,
      tapToDismiss: true,
      enableHtml: false,
      messageClass: 'toast-message-rtl',
      titleClass: 'toast-title-rtl'
    }),
    importProvidersFrom(ReactiveFormsModule)
  ]
};
