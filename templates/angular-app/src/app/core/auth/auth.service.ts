import { HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiClientService } from '../api/api-client.service';
import { SKIP_AUTH, SKIP_GLOBAL_ERROR } from '../http/http-context';
import { User } from '../models/user.model';
import { AuthStore } from './auth.store';
import { LoginPayload, RegisterPayload } from './auth.models';

const skipAuth = new HttpContext().set(SKIP_AUTH, true).set(SKIP_GLOBAL_ERROR, true);

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiClientService);
  private readonly store = inject(AuthStore);
  private readonly router = inject(Router);

  readonly user = this.store.user;
  readonly isAuthenticated = this.store.isAuthenticated;

  login(payload: LoginPayload): Observable<User> {
    return this.api.post<{ user: User }>('/auth/login', payload, skipAuth).pipe(
      map((data) => data.user),
      tap((user) => this.store.setUser(user)),
    );
  }

  register(payload: RegisterPayload): Observable<User> {
    return this.api.post<{ user: User }>('/auth/register', payload, skipAuth).pipe(
      map((data) => data.user),
      tap((user) => this.store.setUser(user)),
    );
  }

  logout(): Observable<void> {
    return this.api.post<void>('/auth/logout', {}).pipe(
      catchError(() => of(undefined)),
      tap(() => {
        this.store.clear();
        void this.router.navigateByUrl('/login');
      }),
    );
  }

  currentUser(): Observable<User | null> {
    this.store.setLoading(true);
    return this.api.get<{ user: User }>('/auth/me', undefined, skipAuth).pipe(
      map((data) => data.user),
      tap((user) => {
        this.store.setUser(user);
        this.store.setLoading(false);
      }),
      catchError(() => {
        this.store.clear();
        this.store.setLoading(false);
        return of(null);
      }),
    );
  }

  forgotPassword(email: string): Observable<void> {
    return this.api.post<void>('/auth/forgot-password', { email }, skipAuth);
  }

  resetPassword(token: string, password: string): Observable<void> {
    return this.api.post<void>('/auth/reset-password', { token, password }, skipAuth);
  }

  devLogin(): Observable<User> {
    if (!environment.allowDevLogin || environment.production) {
      throw new Error('Development login is disabled.');
    }
    const user: User = {
      id: 'dev-user',
      email: 'dev@localhost',
      firstName: 'Local',
      lastName: 'Developer',
      name: 'Local Developer',
      role: 'admin',
      avatarUrl: null,
      isActive: true,
    };
    this.store.setUser(user);
    return of(user);
  }
}
