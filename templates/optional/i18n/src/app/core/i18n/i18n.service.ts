import { Injectable, signal } from '@angular/core';
import { EN_MESSAGES } from './en';

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly messages = signal<Record<string, string>>(EN_MESSAGES);
  readonly locale = signal('en');

  t(key: string): string {
    return this.messages()[key] ?? key;
  }
}
