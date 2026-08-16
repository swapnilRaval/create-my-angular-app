import { FormControl, FormGroup } from '@angular/forms';
import { AppValidators } from './app.validators';

describe('AppValidators', () => {
  it('validates email addresses', () => {
    expect(AppValidators.email(new FormControl('ada@example.com'))).toBeNull();
    expect(AppValidators.email(new FormControl('not-an-email'))).toEqual({ email: true });
  });

  it('requires a strong password', () => {
    expect(AppValidators.password(new FormControl('Password1'))).toBeNull();
    expect(AppValidators.password(new FormControl('short'))).toEqual({ password: true });
  });

  it('matches sibling controls', () => {
    const form = new FormGroup({
      password: new FormControl('Password1'),
      confirmPassword: new FormControl('Password2', AppValidators.match('password')),
    });
    expect(form.controls.confirmPassword.errors).toEqual({ mismatch: true });
    form.controls.confirmPassword.setValue('Password1');
    expect(form.controls.confirmPassword.errors).toBeNull();
  });
});
