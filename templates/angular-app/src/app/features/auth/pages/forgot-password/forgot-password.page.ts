import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../../core/auth/auth.service';
import { AppValidators } from '../../../../shared/validators/app.validators';

@Component({
  selector: 'app-forgot-password-page',
  imports: [ReactiveFormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <section class="auth">
      <mat-card>
        <mat-card-title>Forgot password</mat-card-title>
        <form [formGroup]="form" (ngSubmit)="submit()">
          @if (sent()) {
            <p role="status">If that email exists, a reset link has been sent.</p>
          }
          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <input matInput type="email" formControlName="email" autocomplete="email" />
          </mat-form-field>
          <button mat-flat-button type="submit" [disabled]="submitting()">Send reset link</button>
        </form>
        <a routerLink="/login">Back to login</a>
      </mat-card>
    </section>
  `,
  styles: `
    .auth { min-height: 100vh; display: grid; place-items: center; padding: 1.5rem; }
    form { display: grid; gap: 0.75rem; margin-top: 1rem; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  readonly submitting = signal(false);
  readonly sent = signal(false);
  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, AppValidators.email]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.auth.forgotPassword(this.form.controls.email.value).subscribe({
      next: () => {
        this.submitting.set(false);
        this.sent.set(true);
      },
      error: () => {
        this.submitting.set(false);
        this.sent.set(true);
      },
    });
  }
}
