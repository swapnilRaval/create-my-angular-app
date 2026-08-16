import { Injectable, computed, signal } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly userState = signal<User | null>(null);
  private readonly loadingState = signal(false);

  readonly user = this.userState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly isAuthenticated = computed(() => Boolean(this.userState()));
  readonly role = computed(() => this.userState()?.role ?? null);

  setUser(user: User | null): void {
    this.userState.set(user);
  }

  setLoading(value: boolean): void {
    this.loadingState.set(value);
  }

  clear(): void {
    this.userState.set(null);
  }
}
