import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'users',
  },
  {
    path: 'users',
    loadComponent: () =>
      import('../features/admin/pages/admin-users/admin-users.page').then((m) => m.AdminUsersPage),
    title: 'Admin users',
    data: { breadcrumb: 'Admin users' },
  },
  {
    path: 'roles',
    loadComponent: () =>
      import('../features/admin/pages/admin-roles/admin-roles.page').then((m) => m.AdminRolesPage),
    title: 'Roles',
    data: { breadcrumb: 'Roles' },
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('../features/admin/pages/admin-settings/admin-settings.page').then(
        (m) => m.AdminSettingsPage,
      ),
    title: 'Admin settings',
    data: { breadcrumb: 'Admin settings' },
  },
];
