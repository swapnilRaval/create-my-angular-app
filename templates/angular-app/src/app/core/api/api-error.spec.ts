import { HttpErrorResponse } from '@angular/common/http';
import { normalizeHttpError } from './api-error';

describe('normalizeHttpError', () => {
  it('maps HTTP status codes to safe messages', () => {
    const error = normalizeHttpError(
      new HttpErrorResponse({ status: 404, statusText: 'Not Found', url: '/users/1' }),
    );
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe('The requested resource was not found.');
  });

  it('never exposes a stack trace from the payload', () => {
    const error = normalizeHttpError(
      new HttpErrorResponse({
        status: 500,
        error: { message: 'Database exploded', stack: 'at Query.run' },
      }),
    );
    expect(error.message).toBe('Database exploded');
    expect(error.message.includes('at Query.run')).toBe(false);
  });
});
