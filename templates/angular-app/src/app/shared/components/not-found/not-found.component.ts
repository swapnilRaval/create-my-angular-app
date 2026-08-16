import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, MatButtonModule],
  template: `
    <section class="wrap">
      <h1>Page not found</h1>
      <p>The page you requested does not exist or was moved.</p>
      <a mat-flat-button routerLink="/">Go home</a>
    </section>
  `,
  styles: `
    .wrap {
      text-align: center;
      padding: 4rem 1rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent {}
