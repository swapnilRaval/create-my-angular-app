import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../auth/auth.store';
import { Permission, ROLE_PERMISSIONS } from '../models/user.model';

export const permissionGuard: CanActivateFn = (route) => {
  const store = inject(AuthStore);
  const router = inject(Router);
  const required = (route.data['requiredPermission'] as Permission[] | undefined) ?? [];
  const role = store.role();
  const granted = role ? ROLE_PERMISSIONS[role] : [];

  if (!required.length || required.every((permission) => granted.includes(permission))) {
    return true;
  }

  return router.createUrlTree(['/dashboard']);
};
