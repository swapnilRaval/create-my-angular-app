import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { apiConfig } from './api-config';
import { ApiResponse } from '../models/api.model';

@Injectable({ providedIn: 'root' })
export class ApiClientService {
  private readonly http = inject(HttpClient);

  get<T>(path: string, params?: Record<string, string | number | boolean | undefined>, context?: HttpContext) {
    return this.request<T>('GET', path, { params, context });
  }

  post<T>(path: string, body?: unknown, context?: HttpContext) {
    return this.request<T>('POST', path, { body, context });
  }

  put<T>(path: string, body?: unknown, context?: HttpContext) {
    return this.request<T>('PUT', path, { body, context });
  }

  patch<T>(path: string, body?: unknown, context?: HttpContext) {
    return this.request<T>('PATCH', path, { body, context });
  }

  delete<T>(path: string, context?: HttpContext) {
    return this.request<T>('DELETE', path, { context });
  }

  upload<T>(path: string, formData: FormData, context?: HttpContext): Observable<T> {
    return this.http
      .post<ApiResponse<T> | T>(this.url(path), formData, { context })
      .pipe(map((payload) => this.unwrap(payload)));
  }

  uploadEvents<T>(path: string, formData: FormData, context?: HttpContext) {
    return this.http.post<ApiResponse<T> | T>(this.url(path), formData, {
      reportProgress: true,
      observe: 'events',
      context,
    });
  }

  private request<T>(
    method: string,
    path: string,
    options: {
      body?: unknown;
      params?: Record<string, string | number | boolean | undefined>;
      context?: HttpContext;
    },
  ): Observable<T> {
    let params = new HttpParams();
    for (const [key, value] of Object.entries(options.params ?? {})) {
      if (value !== undefined && value !== '') {
        params = params.set(key, String(value));
      }
    }

    return this.http
      .request<ApiResponse<T> | T>(method, this.url(path), {
        body: options.body,
        params,
        context: options.context,
      })
      .pipe(map((payload) => this.unwrap(payload)));
  }

  private unwrap<T>(payload: ApiResponse<T> | T): T {
    if (payload && typeof payload === 'object' && 'data' in payload) {
      return (payload as ApiResponse<T>).data;
    }
    return payload as T;
  }

  private url(path: string): string {
    return `${apiConfig.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
  }
}
