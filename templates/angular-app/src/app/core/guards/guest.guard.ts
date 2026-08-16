import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { AuthStore } from '../auth/auth.store';

export const guestGuard: CanActivateFn = () => {
  const store = inject(AuthStore);
  const auth = inject(AuthService);
  const router = inject(Router);

  if (store.isAuthenticated()) {
    return router.createUrlTree(['/dashboard']);
  }

  return auth.currentUser().pipe(map((user) => (user ? router.createUrlTree(['/dashboard']) : true)));
};
