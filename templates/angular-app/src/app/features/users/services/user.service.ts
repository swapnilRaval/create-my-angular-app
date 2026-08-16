import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiClientService } from '../../../core/api/api-client.service';
import { PaginatedResponse, PaginationParams } from '../../../core/models/api.model';
import { User } from '../../../core/models/user.model';
import { normalizeUser } from '../../../core/utils/normalize-user';

export interface UserFormValue {
  firstName: string;
  lastName: string;
  email: string;
  role: User['role'];
  isActive: boolean;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly api = inject(ApiClientService);

  list(params: PaginationParams): Observable<PaginatedResponse<User>> {
    return this.api
      .get<PaginatedResponse<unknown> | unknown[]>('/users', {
        page: params.page,
        pageSize: params.pageSize,
        search: params.search,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
      })
      .pipe(map((data) => this.unwrapList(data)));
  }

  getById(id: string): Observable<User> {
    return this.api.get<unknown>(`/users/${id}`).pipe(map((data) => this.unwrapUser(data)));
  }

  create(input: UserFormValue): Observable<User> {
    return this.api.post<unknown>('/users', input).pipe(map((data) => this.unwrapUser(data)));
  }

  update(id: string, input: UserFormValue): Observable<User> {
    return this.api.put<unknown>(`/users/${id}`, input).pipe(map((data) => this.unwrapUser(data)));
  }

  remove(id: string): Observable<void> {
    return this.api.delete<void>(`/users/${id}`);
  }

  uploadAvatar(file: File): Observable<unknown> {
    const body = new FormData();
    body.append('image', file);
    return this.api.upload('/users/profile-image', body);
  }

  private unwrapUser(data: unknown): User {
    const record = data && typeof data === 'object' && 'user' in data ? (data as { user: unknown }).user : data;
    return normalizeUser(record);
  }

  private unwrapList(data: unknown): PaginatedResponse<User> {
    if (data && typeof data === 'object' && 'items' in data) {
      const payload = data as PaginatedResponse<unknown>;
      return { ...payload, items: payload.items.map(normalizeUser) };
    }
    if (Array.isArray(data)) {
      return { items: data.map(normalizeUser), total: data.length, page: 1, pageSize: data.length || 10 };
    }
    return { items: [], total: 0, page: 1, pageSize: 10 };
  }
}
