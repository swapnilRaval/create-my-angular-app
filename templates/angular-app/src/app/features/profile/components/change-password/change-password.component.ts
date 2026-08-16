import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AppValidators } from '../../../../shared/validators/app.validators';
import { FormErrorComponent } from '../../../../shared/components/form-error/form-error.component';
import { NotificationService } from '../../../../core/services/notification.service';
import { ApiClientService } from '../../../../core/api/api-client.service';
import { ApiError } from '../../../../core/api/api-error';

@Component({
  selector: 'app-change-password',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormErrorComponent,
  ],
  template: `
    <mat-card>
      <mat-card-title>Change password</mat-card-title>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <mat-form-field appearance="outline">
          <mat-label>Current password</mat-label>
          <input matInput type="password" formControlName="currentPassword" autocomplete="current-password" />
          <app-form-error controlName="currentPassword" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>New password</mat-label>
          <input matInput type="password" formControlName="password" autocomplete="new-password" />
          <app-form-error controlName="password" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Confirm password</mat-label>
          <input matInput type="password" formControlName="confirmPassword" autocomplete="new-password" />
          <app-form-error controlName="confirmPassword" />
        </mat-form-field>
        <button mat-flat-button type="submit" [disabled]="submitting()">Update password</button>
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
export class ChangePasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiClientService);
  private readonly notifications = inject(NotificationService);
  readonly submitting = signal(false);
  readonly form = this.fb.nonNullable.group({
    currentPassword: ['', Validators.required],
    password: ['', [Validators.required, AppValidators.password]],
    confirmPassword: ['', [Validators.required, AppValidators.match('password')]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    const { currentPassword, password } = this.form.getRawValue();
    this.api.post<void>('/auth/change-password', { currentPassword, password }).subscribe({
      next: () => {
        this.submitting.set(false);
        this.form.reset();
        this.notifications.success('Password updated');
      },
      error: (err: unknown) => {
        this.submitting.set(false);
        this.notifications.error(err instanceof ApiError ? err.message : 'Unable to update password.');
      },
    });
  }
}
