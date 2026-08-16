import { InjectionToken } from '@angular/core';

/**
 * Optional injection point if a backend later requires an Authorization header.
 * The default architecture uses httpOnly cookies and does not store tokens
 * in localStorage or sessionStorage.
 */
export const ACCESS_TOKEN = new InjectionToken<string | null>('ACCESS_TOKEN', {
  providedIn: 'root',
  factory: () => null,
});
