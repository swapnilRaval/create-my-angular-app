import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorBody } from '../models/api.model';

export class ApiError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly errors: Record<string, string>;

  constructor(body: ApiErrorBody) {
    super(body.message);
    this.name = 'ApiError';
    this.statusCode = body.statusCode;
    this.code = body.code ?? 'API_ERROR';
    this.errors = body.errors ?? {};
  }
}

export function normalizeHttpError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof HttpErrorResponse) {
    const payload = error.error && typeof error.error === 'object' ? error.error : {};
    const message =
      typeof payload.message === 'string' && payload.message
        ? payload.message
        : safeStatusMessage(error.status);
    return new ApiError({
      statusCode: error.status || 0,
      message,
      code: payload.code,
      errors: payload.errors ?? {},
    });
  }

  return new ApiError({
    statusCode: 0,
    message: 'A network error occurred. Check your connection and try again.',
    code: 'NETWORK',
  });
}

function safeStatusMessage(status: number): string {
  switch (status) {
    case 400:
      return 'The request was invalid.';
    case 401:
      return 'You need to sign in to continue.';
    case 403:
      return 'You do not have permission to do that.';
    case 404:
      return 'The requested resource was not found.';
    case 409:
      return 'This record already exists.';
    case 422:
      return 'Some fields could not be validated.';
    case 429:
      return 'Too many requests. Try again shortly.';
    case 500:
    case 503:
      return 'The service is unavailable right now.';
    default:
      return 'The request failed.';
  }
}
