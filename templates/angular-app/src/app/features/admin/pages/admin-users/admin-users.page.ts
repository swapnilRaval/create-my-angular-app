import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-admin-users-page',
  imports: [RouterLink, MatCardModule, MatButtonModule],
  template: `
    <mat-card>
      <mat-card-title>Admin users</mat-card-title>
      <p>Use the Users feature as the operational list. This page is the admin-shell example.</p>
      <a mat-flat-button routerLink="/users">Open users</a>
    </mat-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUsersPage {}
