import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-admin-roles-page',
  imports: [MatCardModule],
  template: `
    <mat-card>
      <mat-card-title>Roles</mat-card-title>
      <p>admin, manager, user, and viewer. Frontend checks are UX only.</p>
    </mat-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminRolesPage {}
