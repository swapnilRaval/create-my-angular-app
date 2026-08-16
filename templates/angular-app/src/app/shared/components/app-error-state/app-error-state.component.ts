import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-error-state',
  imports: [MatButtonModule],
  template: `
    <section class="wrap" role="alert">
      <h3>{{ title() }}</h3>
      <p>{{ message() }}</p>
      <button mat-flat-button type="button" (click)="retry.emit()">Retry</button>
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
export class AppErrorStateComponent {
  readonly title = input('Unable to load this content');
  readonly message = input('Please try again.');
  readonly retry = output<void>();
}
