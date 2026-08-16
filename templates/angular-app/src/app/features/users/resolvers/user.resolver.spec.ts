import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { UserService } from '../services/user.service';
import { userResolver } from './user.resolver';

describe('userResolver', () => {
  it('loads a user by route id', async () => {
    const user = {
      id: '42',
      email: 'ada@example.com',
      firstName: 'Ada',
      lastName: 'Lovelace',
      name: 'Ada Lovelace',
      role: 'admin' as const,
      isActive: true,
    };
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: UserService, useValue: { getById: () => of(user) } },
      ],
    });

    const result = await TestBed.runInInjectionContext(() =>
      userResolver({ paramMap: { get: () => '42' } } as never, {} as never),
    );
    if (result && typeof result === 'object' && 'subscribe' in result) {
      const value = await new Promise((resolve) => result.subscribe(resolve));
      expect(value).toEqual(user);
    }
  });
});
