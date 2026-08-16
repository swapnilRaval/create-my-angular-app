import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AppEmptyStateComponent } from '../../../../shared/components/app-empty-state/app-empty-state.component';
import { AppErrorStateComponent } from '../../../../shared/components/app-error-state/app-error-state.component';
import { AppLoadingComponent } from '../../../../shared/components/app-loading/app-loading.component';

@Component({
  selector: 'app-dashboard-page',
  imports: [MatCardModule, AppEmptyStateComponent, AppErrorStateComponent, AppLoadingComponent],
  template: `
    <h1>Dashboard</h1>
    <section class="grid">
      @for (card of stats; track card.label) {
        <mat-card>
          <mat-card-subtitle>{{ card.label }}</mat-card-subtitle>
          <mat-card-title>{{ card.value }}</mat-card-title>
        </mat-card>
      }
      <mat-card class="wide">
        <mat-card-title>Recent activity</mat-card-title>
        <ul>
          @for (item of activity; track item) {
            <li>{{ item }}</li>
          }
        </ul>
      </mat-card>
      <mat-card>
        <mat-card-title>Loading example</mat-card-title>
        <app-loading label="Fetching reports" />
      </mat-card>
      <mat-card>
        <app-empty-state title="No reports yet" />
      </mat-card>
      <mat-card>
        <app-error-state title="Sample error state" message="The API is not connected yet." />
      </mat-card>
      <mat-card class="wide chart">
        Chart placeholder. Add a chart library later if you need visualizations.
      </mat-card>
    </section>
  `,
  styles: `
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1rem;
    }
    .wide {
      grid-column: 1 / -1;
    }
    .chart {
      min-height: 180px;
      display: grid;
      place-items: center;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {
  readonly stats = [
    { label: 'Open items', value: '24' },
    { label: 'Active users', value: '18' },
    { label: 'Pending reviews', value: '6' },
  ];
  readonly activity = ['Profile updated', 'New user invited', 'Settings saved'];
}
