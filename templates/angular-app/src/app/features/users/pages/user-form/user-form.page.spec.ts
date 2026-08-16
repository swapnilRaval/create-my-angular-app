import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { UserService } from '../../services/user.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { UserFormPage } from './user-form.page';

describe('UserFormPage', () => {
  it('blocks navigation while dirty', () => {
    TestBed.configureTestingModule({
      imports: [UserFormPage],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        { provide: UserService, useValue: { create: () => of({ id: '1' }), update: () => of({ id: '1' }) } },
        { provide: NotificationService, useValue: { success: () => undefined, error: () => undefined } },
      ],
    });
    const fixture = TestBed.createComponent(UserFormPage);
    fixture.detectChanges();
    expect(fixture.componentInstance.canLeave()).toBe(true);
    fixture.componentInstance.form.controls.firstName.setValue('Ada');
    expect(fixture.componentInstance.canLeave()).toBe(false);
  });
});
