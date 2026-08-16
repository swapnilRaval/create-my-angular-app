import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-empty-state',
  imports: [MatButtonModule],
  template: `
    <section class="wrap">
      <h3>{{ title() }}</h3>
      <p>{{ description() }}</p>
      @if (actionLabel()) {
        <button mat-flat-button type="button" (click)="action.emit()">{{ actionLabel() }}</button>
      }
    </section>
  `,
  styles: `
    .wrap {
      text-align: center;
      padding: 2.5rem 1rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppEmptyStateComponent {
  readonly title = input('Nothing here yet');
  readonly description = input('When records are available they will appear in this list.');
  readonly actionLabel = input<string | undefined>(undefined);
  readonly action = output<void>();
}
