import { User, UserRole } from '../models/user.model';

function asRole(value: unknown): UserRole {
  if (value === 'admin' || value === 'manager' || value === 'user' || value === 'viewer') {
    return value;
  }
  return 'user';
}

export function normalizeUser(input: unknown): User {
  const record = input && typeof input === 'object' ? (input as Record<string, unknown>) : {};
  const firstName = String(record['firstName'] ?? record['first_name'] ?? '');
  const lastName = String(record['lastName'] ?? record['last_name'] ?? '');
  const name =
    String(record['name'] ?? '').trim() ||
    [firstName, lastName].filter(Boolean).join(' ') ||
    String(record['email'] ?? 'User');

  return {
    id: String(record['id'] ?? record['_id'] ?? ''),
    email: String(record['email'] ?? ''),
    firstName,
    lastName,
    name,
    role: asRole(record['role']),
    avatarUrl: typeof record['avatarUrl'] === 'string' ? record['avatarUrl'] : null,
    isActive: record['isActive'] !== false,
    createdAt: typeof record['createdAt'] === 'string' ? record['createdAt'] : undefined,
    updatedAt: typeof record['updatedAt'] === 'string' ? record['updatedAt'] : undefined,
  };
}
