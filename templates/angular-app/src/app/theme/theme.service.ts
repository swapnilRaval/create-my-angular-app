import { Injectable, computed, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'app.theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly modeState = signal<ThemeMode>(this.readInitial());
  readonly mode = this.modeState.asReadonly();
  readonly resolved = computed(() => this.resolve(this.modeState()));

  constructor() {
    this.apply(this.modeState());
  }

  setMode(mode: ThemeMode): void {
    this.modeState.set(mode);
    this.persist(mode);
    this.apply(mode);
  }

  cycle(): void {
    const order: ThemeMode[] = ['system', 'light', 'dark'];
    const next = order[(order.indexOf(this.modeState()) + 1) % order.length];
    this.setMode(next);
  }

  private resolve(mode: ThemeMode): 'light' | 'dark' {
    if (mode !== 'system') {
      return mode;
    }
    if (!this.isBrowser()) {
      return 'light';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private apply(mode: ThemeMode): void {
    if (!this.isBrowser()) {
      return;
    }
    const resolved = this.resolve(mode);
    document.documentElement.dataset['theme'] = resolved;
    document.documentElement.style.colorScheme = resolved;
  }

  private readInitial(): ThemeMode {
    if (!this.isBrowser()) {
      return 'system';
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
  }

  private persist(mode: ThemeMode): void {
    if (!this.isBrowser()) {
      return;
    }
    localStorage.setItem(STORAGE_KEY, mode);
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
  }
}
