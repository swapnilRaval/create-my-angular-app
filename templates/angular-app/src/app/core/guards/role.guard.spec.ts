import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthStore } from '../auth/auth.store';
import { roleGuard } from './role.guard';

describe('roleGuard', () => {
  it('blocks users without the required role', () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    TestBed.inject(AuthStore).setUser({
      id: '1',
      email: 'ada@example.com',
      firstName: 'Ada',
      lastName: 'Lovelace',
      name: 'Ada Lovelace',
      role: 'viewer',
      isActive: true,
    });

    const result = TestBed.runInInjectionContext(() =>
      roleGuard({ data: { requiredRole: ['admin'] } } as never, {} as never),
    );
    expect(result).not.toBe(true);
  });
});
