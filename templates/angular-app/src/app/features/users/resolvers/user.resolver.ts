import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { User } from '../../../core/models/user.model';
import { UserService } from '../services/user.service';

export const userResolver: ResolveFn<User | null> = (route) => {
  const users = inject(UserService);
  const router = inject(Router);
  const id = route.paramMap.get('id');
  if (!id) {
    void router.navigateByUrl('/users');
    return of(null);
  }
  return users.getById(id).pipe(
    catchError(() => {
      void router.navigateByUrl('/users');
      return of(null);
    }),
  );
};
