import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading',
  imports: [MatProgressSpinnerModule],
  template: `
    <div class="wrap" role="status">
      <mat-progress-spinner diameter="36" mode="indeterminate" />
      <p>{{ label() }}</p>
    </div>
  `,
  styles: `
    .wrap {
      display: grid;
      place-items: center;
      gap: 0.75rem;
      padding: 2rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppLoadingComponent {
  readonly label = input('Loading');
}
