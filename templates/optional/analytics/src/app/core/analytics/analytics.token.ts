import { InjectionToken } from '@angular/core';

export interface AnalyticsService {
  track(event: string, props?: Record<string, string | number | boolean>): void;
}

export const ANALYTICS = new InjectionToken<AnalyticsService>('ANALYTICS');
