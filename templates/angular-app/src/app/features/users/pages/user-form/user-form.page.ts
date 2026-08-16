import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { User } from '../../../../core/models/user.model';
import { UserService } from '../../services/user.service';
import { AppValidators } from '../../../../shared/validators/app.validators';
import { NotificationService } from '../../../../core/services/notification.service';
import { ApiError } from '../../../../core/api/api-error';
import { CanLeave } from '../../../../core/guards/unsaved-changes.guard';

@Component({
  selector: 'app-user-form-page',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
  ],
  template: `
    <mat-card>
      <mat-card-title>{{ user() ? 'Edit user' : 'New user' }}</mat-card-title>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <mat-form-field appearance="outline">
          <mat-label>First name</mat-label>
          <input matInput formControlName="firstName" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Last name</mat-label>
          <input matInput formControlName="lastName" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Role</mat-label>
          <mat-select formControlName="role">
            <mat-option value="admin">Admin</mat-option>
            <mat-option value="manager">Manager</mat-option>
            <mat-option value="user">User</mat-option>
            <mat-option value="viewer">Viewer</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-checkbox formControlName="isActive">Active</mat-checkbox>
        <button mat-flat-button type="submit" [disabled]="submitting()">Save user</button>
      </form>
    </mat-card>
  `,
  styles: `
    form {
      display: grid;
      gap: 0.75rem;
      margin-top: 1rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormPage implements CanLeave {
  private readonly fb = inject(FormBuilder);
  private readonly users = inject(UserService);
  private readonly router = inject(Router);
  private readonly notifications = inject(NotificationService);
  readonly user = input<User | null>(null);
  readonly submitting = signal(false);
  readonly form = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, AppValidators.email]],
    role: this.fb.nonNullable.control<User['role']>('user'),
    isActive: [true],
  });

  constructor() {
    effect(() => {
      const current = this.user();
      if (current) {
        this.form.patchValue(current);
      }
    });
  }

  canLeave(): boolean {
    return this.form.pristine;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    const current = this.user();
    this.submitting.set(true);
    const request = current ? this.users.update(current.id, value) : this.users.create(value);
    request.subscribe({
      next: (saved) => {
        this.form.markAsPristine();
        this.submitting.set(false);
        this.notifications.success('User saved');
        void this.router.navigate(['/users', saved.id]);
      },
      error: (err: unknown) => {
        this.submitting.set(false);
        this.notifications.error(err instanceof ApiError ? err.message : 'Unable to save the user.');
      },
    });
  }
}
