import { Injectable } from '@angular/core';
import { AnalyticsService } from './analytics.token';

@Injectable({ providedIn: 'root' })
export class ConsoleAnalyticsService implements AnalyticsService {
  track(event: string, props?: Record<string, string | number | boolean>): void {
    console.info('[analytics]', event, props ?? {});
  }
}
