import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';
import { AuthStore } from './core/auth/auth.store';

describe('app routes', () => {
  it('renders the public home page', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideNoopAnimations(),
      ],
    });
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/');
    expect(harness.routeNativeElement?.textContent).toMatch(/{{APP_TITLE}}|Get started|Sign in|Dashboard/i);
  });

  it('keeps guests off the dashboard', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideNoopAnimations(),
      ],
    });
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/dashboard');
    expect(router.url.startsWith('/login')).toBe(true);
  });

  it('allows an authenticated user into the dashboard path', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideNoopAnimations(),
      ],
    });
    TestBed.inject(AuthStore).setUser({
      id: '1',
      email: 'ada@example.com',
      firstName: 'Ada',
      lastName: 'Lovelace',
      name: 'Ada Lovelace',
      role: 'admin',
      isActive: true,
    });
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/dashboard');
    expect(router.url.startsWith('/dashboard')).toBe(true);
  });
});
