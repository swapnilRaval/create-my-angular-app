import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { AuthService } from '../../../../core/auth/auth.service';
import { LoginPage } from './login.page';

describe('LoginPage', () => {
  it('marks the form touched when submitted empty', async () => {
    TestBed.configureTestingModule({
      imports: [LoginPage],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        { provide: AuthService, useValue: { login: () => of(null), devLogin: () => of(null) } },
      ],
    });
    const fixture = TestBed.createComponent(LoginPage);
    fixture.detectChanges();
    fixture.componentInstance.submit();
    expect(fixture.componentInstance.form.touched).toBe(true);
    expect(fixture.componentInstance.form.invalid).toBe(true);
  });
});
