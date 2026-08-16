import { Routes } from '@angular/router';
import { unsavedChangesGuard } from '../core/guards/unsaved-changes.guard';
import { userResolver } from '../features/users/resolvers/user.resolver';

export const usersRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../features/users/pages/user-list/user-list.page').then((m) => m.UserListPage),
    title: 'Users',
    data: { breadcrumb: 'Users' },
  },
  {
    path: 'new',
    loadComponent: () =>
      import('../features/users/pages/user-form/user-form.page').then((m) => m.UserFormPage),
    title: 'New user',
    data: { breadcrumb: 'New' },
    canDeactivate: [unsavedChangesGuard],
  },
  {
    path: ':id',
    resolve: { user: userResolver },
    loadComponent: () =>
      import('../features/users/pages/user-detail/user-detail.page').then((m) => m.UserDetailPage),
    title: 'User details',
    data: { breadcrumb: 'Details' },
  },
  {
    path: ':id/edit',
    resolve: { user: userResolver },
    loadComponent: () =>
      import('../features/users/pages/user-form/user-form.page').then((m) => m.UserFormPage),
    title: 'Edit user',
    data: { breadcrumb: 'Edit' },
    canDeactivate: [unsavedChangesGuard],
  },
];
