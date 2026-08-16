import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../auth/auth.store';
import { UserRole } from '../models/user.model';

export const roleGuard: CanActivateFn = (route) => {
  const store = inject(AuthStore);
  const router = inject(Router);
  const allowed = (route.data['requiredRole'] as UserRole[] | undefined) ?? [];
  const role = store.role();

  if (!allowed.length || (role && allowed.includes(role))) {
    return true;
  }

  return router.createUrlTree(['/dashboard']);
};
