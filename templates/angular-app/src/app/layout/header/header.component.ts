import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { ThemeService } from '../../theme/theme.service';
import { SidebarStore } from '../sidebar.store';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatMenuModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private readonly breakpoints = inject(BreakpointObserver);
  readonly auth = inject(AuthService);
  readonly theme = inject(ThemeService);
  readonly sidebar = inject(SidebarStore);
  readonly isMobile = toSignal(this.breakpoints.observe('(max-width: 959px)').pipe(map((s) => s.matches)), {
    initialValue: false,
  });

  constructor() {
    effect(() => this.sidebar.setMobile(this.isMobile()));
  }

  logout(): void {
    this.auth.logout().subscribe();
  }
}
