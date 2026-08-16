import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-admin-settings-page',
  imports: [MatCardModule],
  template: `
    <mat-card>
      <mat-card-title>Admin settings</mat-card-title>
      <p>Add organization-level settings here.</p>
    </mat-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminSettingsPage {}
