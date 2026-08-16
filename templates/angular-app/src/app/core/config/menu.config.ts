import { UserRole } from '../models/user.model';

export interface MenuItem {
  label: string;
  icon: string;
  route: string;
  roles?: UserRole[];
}

export const SIDEBAR_MENU: MenuItem[] = [
  { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
  { label: 'Users', icon: 'people', route: '/users', roles: ['admin', 'manager', 'user'] },
  { label: 'Profile', icon: 'person', route: '/profile' },
  { label: 'Settings', icon: 'settings', route: '/settings' },
  { label: 'Admin users', icon: 'admin_panel_settings', route: '/admin/users', roles: ['admin', 'manager'] },
  { label: 'Roles', icon: 'security', route: '/admin/roles', roles: ['admin', 'manager'] },
];
