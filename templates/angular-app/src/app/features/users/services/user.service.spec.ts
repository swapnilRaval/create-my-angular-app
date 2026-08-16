import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  it('lists users from the API', () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    const service = TestBed.inject(UserService);
    const http = TestBed.inject(HttpTestingController);

    let total = 0;
    service.list({ page: 1, pageSize: 10 }).subscribe((result) => {
      total = result.total;
    });

    const req = http.expectOne((request) => request.url.includes('/users'));
    req.flush({
      items: [
        {
          id: '1',
          email: 'ada@example.com',
          firstName: 'Ada',
          lastName: 'Lovelace',
          role: 'admin',
          isActive: true,
        },
      ],
      total: 1,
      page: 1,
      pageSize: 10,
    });
    expect(total).toBe(1);
  });
});
