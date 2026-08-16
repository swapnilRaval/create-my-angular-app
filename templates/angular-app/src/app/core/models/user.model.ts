export type UserRole = 'admin' | 'manager' | 'user' | 'viewer';

export type Permission = 'USER_READ' | 'USER_CREATE' | 'USER_UPDATE' | 'USER_DELETE';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  role: UserRole;
  avatarUrl?: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: ['USER_READ', 'USER_CREATE', 'USER_UPDATE', 'USER_DELETE'],
  manager: ['USER_READ', 'USER_CREATE', 'USER_UPDATE'],
  user: ['USER_READ'],
  viewer: ['USER_READ'],
};
