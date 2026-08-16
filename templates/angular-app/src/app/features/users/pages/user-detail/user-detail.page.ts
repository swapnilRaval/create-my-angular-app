import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { User } from '../../../../core/models/user.model';
import { AppStatusChipComponent } from '../../../../shared/components/app-status-chip/app-status-chip.component';

@Component({
  selector: 'app-user-detail-page',
  imports: [RouterLink, MatCardModule, MatButtonModule, AppStatusChipComponent],
  template: `
    @if (user(); as current) {
      <mat-card>
        <mat-card-title>{{ current.name }}</mat-card-title>
        <p>Email: {{ current.email }}</p>
        <p>Role: {{ current.role }}</p>
        <app-status-chip [active]="current.isActive" />
        <a mat-flat-button [routerLink]="['/users', current.id, 'edit']">Edit</a>
        <a mat-button routerLink="/users">Back to list</a>
      </mat-card>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailPage {
  readonly user = input<User | null>(null);
}
