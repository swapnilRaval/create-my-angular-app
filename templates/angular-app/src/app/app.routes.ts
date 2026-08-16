import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { roleGuard } from './core/guards/role.guard';
import { unsavedChangesGuard } from './core/guards/unsaved-changes.guard';
import { ShellComponent } from './layout/shell/shell.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/public/home/home.page').then((m) => m.HomePage),
    title: '{{APP_TITLE}}',
    data: { breadcrumb: 'Home' },
  },
  {
    path: '',
    canActivate: [guestGuard],
    loadChildren: () => import('./routes/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./routes/dashboard.routes').then((m) => m.dashboardRoutes),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/profile/pages/profile/profile.page').then((m) => m.ProfilePage),
        title: 'Profile',
        data: { breadcrumb: 'Profile' },
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/pages/settings/settings.page').then((m) => m.SettingsPage),
        title: 'Settings',
        data: { breadcrumb: 'Settings' },
        canDeactivate: [unsavedChangesGuard],
      },
      {
        path: 'users',
        loadChildren: () => import('./routes/users.routes').then((m) => m.usersRoutes),
      },
      {
        path: 'admin',
        canActivate: [roleGuard],
        data: { requiredRole: ['admin', 'manager'], breadcrumb: 'Admin' },
        loadChildren: () => import('./routes/admin.routes').then((m) => m.adminRoutes),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./shared/components/not-found/not-found.component').then((m) => m.NotFoundComponent),
    title: 'Not found',
  },
];
