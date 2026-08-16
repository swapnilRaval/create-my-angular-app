import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { NotificationService } from '../../../../core/services/notification.service';
import { CanLeave } from '../../../../core/guards/unsaved-changes.guard';

@Component({
  selector: 'app-settings-page',
  imports: [ReactiveFormsModule, MatCardModule, MatCheckboxModule, MatButtonModule],
  template: `
    <mat-card>
      <mat-card-title>Settings</mat-card-title>
      <form [formGroup]="form" (ngSubmit)="save()">
        <mat-checkbox formControlName="emailNotifications">Email notifications</mat-checkbox>
        <mat-checkbox formControlName="marketingEmails">Product updates</mat-checkbox>
        <mat-checkbox formControlName="compactSidebar">Compact sidebar</mat-checkbox>
        <button mat-flat-button type="submit">Save settings</button>
      </form>
    </mat-card>
  `,
  styles: `
    form {
      display: grid;
      gap: 0.5rem;
      margin-top: 1rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPage implements CanLeave {
  private readonly fb = inject(FormBuilder);
  private readonly notifications = inject(NotificationService);
  readonly form = this.fb.nonNullable.group({
    emailNotifications: [true],
    marketingEmails: [false],
    compactSidebar: [false],
  });

  canLeave(): boolean {
    return this.form.pristine;
  }

  save(): void {
    this.form.markAsPristine();
    this.notifications.success('Settings saved on this device');
  }
}
