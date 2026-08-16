import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthStore } from '../../../../core/auth/auth.store';
import { AppValidators } from '../../../../shared/validators/app.validators';
import { AvatarUploadComponent } from '../../../../shared/components/avatar-upload/avatar-upload.component';
import { ChangePasswordComponent } from '../../components/change-password/change-password.component';
import { UserService } from '../../../users/services/user.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-profile-page',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    AvatarUploadComponent,
    ChangePasswordComponent,
  ],
  template: `
    <mat-card>
      <mat-card-title>Profile</mat-card-title>
      <app-avatar-upload [name]="auth.user()?.name ?? 'User'" (fileSelected)="upload($event)" />
      <form [formGroup]="form" (ngSubmit)="save()">
        <mat-form-field appearance="outline">
          <mat-label>First name</mat-label>
          <input matInput formControlName="firstName" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Last name</mat-label>
          <input matInput formControlName="lastName" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email" />
        </mat-form-field>
        <button mat-flat-button type="submit">Save profile</button>
      </form>
    </mat-card>
    <app-change-password />
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
export class ProfilePage {
  readonly auth = inject(AuthStore);
  private readonly fb = inject(FormBuilder);
  private readonly users = inject(UserService);
  private readonly notifications = inject(NotificationService);
  readonly form = this.fb.nonNullable.group({
    firstName: [this.auth.user()?.firstName ?? '', Validators.required],
    lastName: [this.auth.user()?.lastName ?? '', Validators.required],
    email: [this.auth.user()?.email ?? '', [Validators.required, AppValidators.email]],
  });

  save(): void {
    this.notifications.info('Wire this form to your backend profile endpoint.');
  }

  upload(file: File): void {
    this.users.uploadAvatar(file).subscribe({
      next: () => this.notifications.success('Photo updated'),
      error: () => this.notifications.error('Unable to save profile photo'),
    });
  }
}
