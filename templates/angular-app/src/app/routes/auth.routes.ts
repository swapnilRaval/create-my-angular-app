import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('../features/auth/pages/login/login.page').then((m) => m.LoginPage),
    title: 'Sign in',
    data: { breadcrumb: 'Sign in' },
  },
  {
    path: 'register',
    loadComponent: () =>
      import('../features/auth/pages/register/register.page').then((m) => m.RegisterPage),
    title: 'Create account',
    data: { breadcrumb: 'Register' },
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('../features/auth/pages/forgot-password/forgot-password.page').then(
        (m) => m.ForgotPasswordPage,
      ),
    title: 'Forgot password',
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('../features/auth/pages/reset-password/reset-password.page').then(
        (m) => m.ResetPasswordPage,
      ),
    title: 'Reset password',
  },
];
