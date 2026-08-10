import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import {provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { routes } from './app.routes';
import { authenticateInterceptor } from './core/interceptors/authenticate-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
     provideHttpClient(
      withFetch(),
      withInterceptors([authenticateInterceptor]) // ✅ Functional interceptor
    ),
    importProvidersFrom(ReactiveFormsModule)
  ]
};
