import { ApplicationConfig, provideBrowserGlobalErrorListeners{{#if PWA}}, isDevMode{{/if}} } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideNativeDateAdapter } from '@angular/material/core';
{{#if PWA}}import { provideServiceWorker } from '@angular/service-worker';
{{/if}}{{#if SENTRY}}import { provideSentry } from './core/monitoring/sentry';
{{/if}}{{#if ANALYTICS}}import { ANALYTICS } from './core/analytics/analytics.token';
import { ConsoleAnalyticsService } from './core/analytics/analytics.service';
{{/if}}import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAnimationsAsync(),
    provideNativeDateAdapter(),
    provideHttpClient(withInterceptors([authInterceptor, loadingInterceptor, errorInterceptor])),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),
    ),{{#if PWA}}
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),{{/if}}{{#if SENTRY}}
    provideSentry(),{{/if}}{{#if ANALYTICS}}
    { provide: ANALYTICS, useClass: ConsoleAnalyticsService },{{/if}}
  ],
};
