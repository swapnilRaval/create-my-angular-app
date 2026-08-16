import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../../core/auth/auth.service';
import { ApiError } from '../../../../core/api/api-error';
import { AppValidators } from '../../../../shared/validators/app.validators';
import { resolveReturnUrl } from '../../../../core/utils/safe-redirect';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-login-page',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly hidePassword = signal(true);
  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);
  readonly allowDevLogin = environment.allowDevLogin;

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, AppValidators.email]],
    password: ['', Validators.required],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.error.set(null);
    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => {
        this.submitting.set(false);
        void this.router.navigateByUrl(resolveReturnUrl(this.route.snapshot.queryParamMap.get('returnUrl')));
      },
      error: (err: unknown) => {
        this.submitting.set(false);
        this.error.set(err instanceof ApiError ? err.message : 'Unable to sign in.');
      },
    });
  }

  devLogin(): void {
    this.submitting.set(true);
    this.auth.devLogin().subscribe({
      next: () => {
        this.submitting.set(false);
        void this.router.navigateByUrl('/dashboard');
      },
      error: (err: unknown) => {
        this.submitting.set(false);
        this.error.set(err instanceof ApiError ? err.message : 'Development login failed.');
      },
    });
  }
}
