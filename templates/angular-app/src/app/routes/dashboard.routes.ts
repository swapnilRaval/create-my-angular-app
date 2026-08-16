import { Routes } from '@angular/router';

export const dashboardRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../features/dashboard/pages/dashboard/dashboard.page').then((m) => m.DashboardPage),
    title: 'Dashboard',
    data: { breadcrumb: 'Dashboard' },
  },
];
