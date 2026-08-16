import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { AbstractControl, ControlContainer } from '@angular/forms';

@Component({
  selector: 'app-form-error',
  template: `
    @if (show()) {
      <p class="error" role="alert">{{ message() }}</p>
    }
  `,
  styles: `
    .error {
      margin: 0.25rem 0 0;
      color: var(--mat-sys-error);
      font-size: 0.8rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormErrorComponent {
  readonly controlName = input.required<string>();
  readonly submitted = input(false);

  private readonly parent = inject(ControlContainer, { optional: true });

  private control(): AbstractControl | null {
    return this.parent?.control?.get(this.controlName()) ?? null;
  }

  show(): boolean {
    const control = this.control();
    return Boolean(control && control.invalid && (control.touched || control.dirty || this.submitted()));
  }

  message(): string {
    const errors = this.control()?.errors ?? {};
    if (errors['required']) return 'This field is required.';
    if (errors['email']) return 'Enter a valid email address.';
    if (errors['password']) return 'Use at least 8 characters with upper, lower, and a number.';
    if (errors['mismatch']) return 'The values do not match.';
    if (errors['phone']) return 'Enter a valid phone number.';
    if (errors['minlength']) return `Enter at least ${errors['minlength'].requiredLength} characters.`;
    if (errors['server']) return String(errors['server']);
    return 'This value is invalid.';
  }
}
