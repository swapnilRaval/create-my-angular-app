import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';
import { User } from '../../../core/models/user.model';
import { UserService } from '../services/user.service';

interface UsersState {
  items: User[];
  loading: boolean;
}

export const UsersStore = signalStore(
  { providedIn: 'root' },
  withState<UsersState>({ items: [], loading: false }),
  withMethods((store, users = inject(UserService)) => ({
    async load(): Promise<void> {
      patchState(store, { loading: true });
      const result = await firstValueFrom(users.list({ page: 1, pageSize: 20 }));
      patchState(store, { items: result.items, loading: false });
    },
  })),
);
