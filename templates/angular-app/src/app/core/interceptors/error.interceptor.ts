import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { normalizeHttpError } from '../api/api-error';
import { AuthStore } from '../auth/auth.store';
import { SKIP_GLOBAL_ERROR } from '../http/http-context';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notifications = inject(NotificationService);
  const store = inject(AuthStore);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: unknown) => {
      const normalized = normalizeHttpError(error);
      if (!req.context.get(SKIP_GLOBAL_ERROR)) {
        notifications.error(normalized.message);
      }
      if (error instanceof HttpErrorResponse && error.status === 401) {
        store.clear();
        void router.navigateByUrl('/login');
      }
      return throwError(() => normalized);
    }),
  );
};
