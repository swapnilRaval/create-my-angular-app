import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

interface Crumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumbs',
  imports: [RouterLink, MatIconModule],
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbsComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly crumbs = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.build(this.route.root, '')),
    ),
    { initialValue: [] as Crumb[] },
  );

  private build(route: ActivatedRoute, prefix: string): Crumb[] {
    const crumbs: Crumb[] = [];
    const snapshot = route.snapshot;
    const segment = snapshot.url.map((part) => part.path).join('/');
    const url = segment ? `${prefix}/${segment}` : prefix || '/';
    const label = snapshot.data['breadcrumb'] as string | undefined;
    if (label) {
      crumbs.push({ label, url });
    }
    if (route.firstChild) {
      crumbs.push(...this.build(route.firstChild, url === '/' ? '' : url));
    }
    return crumbs;
  }
}
