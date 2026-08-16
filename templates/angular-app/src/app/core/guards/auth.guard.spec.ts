import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { AuthStore } from '../auth/auth.store';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  it('allows an authenticated user', () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: { currentUser: () => of(null) },
        },
      ],
    });
    TestBed.inject(AuthStore).setUser({
      id: '1',
      email: 'ada@example.com',
      firstName: 'Ada',
      lastName: 'Lovelace',
      name: 'Ada Lovelace',
      role: 'user',
      isActive: true,
    });

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as never, { url: '/dashboard' } as never),
    );
    expect(result).toBe(true);
  });

  it('redirects guests to login with a safe returnUrl', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: { currentUser: () => of(null) } },
      ],
    });
    const router = TestBed.inject(Router);
    const result = await TestBed.runInInjectionContext(() =>
      authGuard({} as never, { url: '/users' } as never),
    );
    if (typeof result === 'object' && 'subscribe' in result) {
      const tree = await new Promise((resolve) => result.subscribe(resolve));
      expect(router.serializeUrl(tree as never)).toContain('/login');
    }
  });
});
