import { HttpClient, HttpContext, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SKIP_GLOBAL_ERROR } from '../http/http-context';
import { errorInterceptor } from './error.interceptor';

describe('errorInterceptor', () => {
  it('shows a safe snackbar message for API failures', () => {
    const open = vi.fn();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        { provide: MatSnackBar, useValue: { open } },
      ],
    });
    const http = TestBed.inject(HttpClient);
    const controller = TestBed.inject(HttpTestingController);
    http.get('/api/boom').subscribe({ error: () => undefined });
    controller.expectOne('/api/boom').flush({ message: 'Nope' }, { status: 500, statusText: 'Error' });
    expect(open).toHaveBeenCalled();
  });

  it('can skip the global snackbar', () => {
    const open = vi.fn();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        { provide: MatSnackBar, useValue: { open } },
      ],
    });
    const http = TestBed.inject(HttpClient);
    const controller = TestBed.inject(HttpTestingController);
    http
      .get('/api/silent', { context: new HttpContext().set(SKIP_GLOBAL_ERROR, true) })
      .subscribe({ error: () => undefined });
    controller.expectOne('/api/silent').flush({}, { status: 400, statusText: 'Bad Request' });
    expect(open).not.toHaveBeenCalled();
  });
});
