import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, MatButtonModule],
  template: `
    <section class="hero">
      <h1>{{APP_TITLE}}</h1>
      <p>{{PROJECT_DESCRIPTION}}</p>
      <div class="actions">
        <a mat-flat-button routerLink="/login">Sign in</a>
        <a mat-stroked-button routerLink="/dashboard">Open dashboard</a>
      </div>
    </section>
  `,
  styles: `
    .hero {
      max-width: 720px;
      margin: 0 auto;
      padding: 4rem 1.5rem;
    }
    .actions {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {}
