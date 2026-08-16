import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { catchError, debounceTime, distinctUntilChanged, map, of, startWith, switchMap } from 'rxjs';
import { UserService } from '../../services/user.service';
import { AppStatusChipComponent } from '../../../../shared/components/app-status-chip/app-status-chip.component';
import { AppEmptyStateComponent } from '../../../../shared/components/app-empty-state/app-empty-state.component';
import { AppErrorStateComponent } from '../../../../shared/components/app-error-state/app-error-state.component';
import { AppLoadingComponent } from '../../../../shared/components/app-loading/app-loading.component';
import { AppConfirmDialogComponent } from '../../../../shared/components/app-confirm-dialog/app-confirm-dialog.component';
import { NotificationService } from '../../../../core/services/notification.service';
import { ApiError } from '../../../../core/api/api-error';

@Component({
  selector: 'app-user-list-page',
  imports: [
    RouterLink,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    AppStatusChipComponent,
    AppEmptyStateComponent,
    AppErrorStateComponent,
    AppLoadingComponent,
  ],
  templateUrl: './user-list.page.html',
  styleUrl: './user-list.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListPage {
  private readonly users = inject(UserService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly notifications = inject(NotificationService);

  readonly displayedColumns = ['name', 'email', 'role', 'status', 'actions'];
  readonly error = signal<string | null>(null);
  readonly loading = signal(false);

  readonly result = toSignal(
    this.route.queryParamMap.pipe(
      map((params) => ({
        page: Number(params.get('page') ?? 1),
        pageSize: Number(params.get('pageSize') ?? 10),
        search: params.get('search') ?? '',
        sortBy: params.get('sortBy') ?? 'createdAt',
        sortOrder: (params.get('sortOrder') as 'asc' | 'desc') ?? 'desc',
      })),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      debounceTime(150),
      switchMap((query) => {
        this.loading.set(true);
        this.error.set(null);
        return this.users.list(query).pipe(
          map((data) => {
            this.loading.set(false);
            return { query, data };
          }),
          catchError((err: unknown) => {
            this.loading.set(false);
            this.error.set(err instanceof ApiError ? err.message : 'Unable to load users.');
            return of({
              query,
              data: { items: [], total: 0, page: query.page, pageSize: query.pageSize },
            });
          }),
        );
      }),
      startWith(null),
    ),
    { initialValue: null },
  );

  updateQuery(patch: Record<string, string | number>): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: patch,
      queryParamsHandling: 'merge',
    });
  }

  onSearch(value: string): void {
    this.updateQuery({ search: value, page: 1 });
  }

  onPage(event: PageEvent): void {
    this.updateQuery({ page: event.pageIndex + 1, pageSize: event.pageSize });
  }

  onSort(sort: Sort): void {
    this.updateQuery({ sortBy: sort.active, sortOrder: sort.direction || 'asc' });
  }

  remove(id: string, email: string): void {
    this.dialog
      .open(AppConfirmDialogComponent, {
        data: { title: 'Delete this user?', message: `This asks the API to delete ${email}.` },
      })
      .afterClosed()
      .subscribe((ok) => {
        if (!ok) return;
        this.users.remove(id).subscribe({
          next: () => this.notifications.success('User deleted'),
          error: (err: unknown) =>
            this.notifications.error(err instanceof ApiError ? err.message : 'Unable to delete the user.'),
        });
      });
  }
}
