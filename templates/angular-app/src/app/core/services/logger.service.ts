import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LoggerService {
  info(message: string, context?: Record<string, unknown>): void {
    if (!environment.production) {
      console.info(message, context ?? '');
    }
  }

  error(message: string, context?: Record<string, unknown>): void {
    console.error(message, context ?? '');
  }
}
