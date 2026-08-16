import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../../core/auth/auth.service';
import { AppValidators } from '../../../../shared/validators/app.validators';
import { ApiError } from '../../../../core/api/api-error';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <section class="auth">
      <mat-card>
        <mat-card-title>Create account</mat-card-title>
        <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
          @if (error()) {
            <p class="error" role="alert">{{ error() }}</p>
          }
          <mat-form-field appearance="outline">
            <mat-label>First name</mat-label>
            <input matInput formControlName="firstName" autocomplete="given-name" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Last name</mat-label>
            <input matInput formControlName="lastName" autocomplete="family-name" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <input matInput type="email" formControlName="email" autocomplete="email" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Password</mat-label>
            <input matInput type="password" formControlName="password" autocomplete="new-password" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Confirm password</mat-label>
            <input matInput type="password" formControlName="confirmPassword" autocomplete="new-password" />
            @if (form.controls.confirmPassword.hasError('mismatch')) {
              <mat-error>Passwords do not match</mat-error>
            }
          </mat-form-field>
          <button mat-flat-button type="submit" [disabled]="submitting()">Create account</button>
        </form>
        <a routerLink="/login">Already registered?</a>
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
export class RegisterPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);
  readonly form = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, AppValidators.email]],
    password: ['', [Validators.required, AppValidators.minLength(8)]],
    confirmPassword: ['', [Validators.required, AppValidators.match('password')]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { firstName, lastName, email, password } = this.form.getRawValue();
    this.submitting.set(true);
    this.auth.register({ firstName, lastName, email, password }).subscribe({
      next: () => {
        this.submitting.set(false);
        void this.router.navigateByUrl('/dashboard');
      },
      error: (err: unknown) => {
        this.submitting.set(false);
        this.error.set(err instanceof ApiError ? err.message : 'Unable to register.');
      },
    });
  }
}
