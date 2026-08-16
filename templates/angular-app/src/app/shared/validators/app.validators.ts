import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class AppValidators {
  static email(control: AbstractControl): ValidationErrors | null {
    const value = String(control.value ?? '').trim();
    if (!value) return null;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : { email: true };
  }

  static minLength(min: number): ValidatorFn {
    return (control) => {
      const value = String(control.value ?? '');
      return value && value.length < min ? { minlength: { requiredLength: min } } : null;
    };
  }

  static match(otherControlName: string): ValidatorFn {
    return (control) => {
      const parent = control.parent;
      if (!parent) return null;
      const other = parent.get(otherControlName);
      return other && other.value !== control.value ? { mismatch: true } : null;
    };
  }

  static password(control: AbstractControl): ValidationErrors | null {
    const value = String(control.value ?? '');
    if (!value) return null;
    const strong = value.length >= 8 && /[A-Z]/.test(value) && /[a-z]/.test(value) && /\d/.test(value);
    return strong ? null : { password: true };
  }

  static phone(control: AbstractControl): ValidationErrors | null {
    const value = String(control.value ?? '').trim();
    if (!value) return null;
    return /^[+]?[\d\s()-]{7,}$/.test(value) ? null : { phone: true };
  }
}
