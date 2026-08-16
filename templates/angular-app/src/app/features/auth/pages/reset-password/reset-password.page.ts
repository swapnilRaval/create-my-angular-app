import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../../core/auth/auth.service';
import { AppValidators } from '../../../../shared/validators/app.validators';
import { ApiError } from '../../../../core/api/api-error';

@Component({
  selector: 'app-reset-password-page',
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <section class="auth">
      <mat-card>
        <mat-card-title>Reset password</mat-card-title>
        <form [formGroup]="form" (ngSubmit)="submit()">
          @if (error()) {
            <p class="error" role="alert">{{ error() }}</p>
          }
          <mat-form-field appearance="outline">
            <mat-label>New password</mat-label>
            <input matInput type="password" formControlName="password" autocomplete="new-password" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Confirm password</mat-label>
            <input matInput type="password" formControlName="confirmPassword" autocomplete="new-password" />
          </mat-form-field>
          <button mat-flat-button type="submit" [disabled]="submitting() || !token">Update password</button>
        </form>
      </mat-card>
    </section>
  `,
  styles: `
    .auth { min-height: 100vh; display: grid; place-items: center; padding: 1.5rem; }
    form { display: grid; gap: 0.75rem; margin-top: 1rem; }
    .error { color: var(--mat-sys-error); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly token = inject(ActivatedRoute).snapshot.queryParamMap.get('token') ?? '';
  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);
  readonly form = this.fb.nonNullable.group({
    password: ['', [Validators.required, AppValidators.minLength(8)]],
    confirmPassword: ['', [Validators.required, AppValidators.match('password')]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.auth.resetPassword(this.token, this.form.controls.password.value).subscribe({
      next: () => {
        this.submitting.set(false);
        void this.router.navigateByUrl('/login');
      },
      error: (err: unknown) => {
        this.submitting.set(false);
        this.error.set(err instanceof ApiError ? err.message : 'Unable to reset the password.');
      },
    });
  }
}
