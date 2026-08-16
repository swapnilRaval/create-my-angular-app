import { EnvironmentProviders, ErrorHandler, Provider } from '@angular/core';
import { environment } from '../../../environments/environment';

/**
 * Local development does not require a DSN.
 * Set a DSN in your deployment environment before enabling Sentry.
 */
export function provideSentry(): Array<Provider | EnvironmentProviders> {
  if (!environment.production) {
    return [];
  }
  return [{ provide: ErrorHandler, useClass: ErrorHandler }];
}
