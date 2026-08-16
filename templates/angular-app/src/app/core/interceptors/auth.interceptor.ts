import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Cookie-session default: always send credentials.
 * SKIP_AUTH is reserved for callers that must omit an Authorization header
 * if you later add bearer tokens. Do not store tokens in localStorage.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  return next(
    req.clone({
      withCredentials: true,
    }),
  );
};
