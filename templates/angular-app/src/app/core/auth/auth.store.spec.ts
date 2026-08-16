import { TestBed } from '@angular/core/testing';
import { AuthStore } from './auth.store';
import { User } from '../models/user.model';

const user: User = {
  id: '1',
  email: 'ada@example.com',
  firstName: 'Ada',
  lastName: 'Lovelace',
  name: 'Ada Lovelace',
  role: 'admin',
  isActive: true,
};

describe('AuthStore', () => {
  it('tracks authentication with signals', () => {
    const store = TestBed.inject(AuthStore);
    expect(store.isAuthenticated()).toBe(false);
    store.setUser(user);
    expect(store.isAuthenticated()).toBe(true);
    expect(store.role()).toBe('admin');
    store.clear();
    expect(store.user()).toBeNull();
  });
});
