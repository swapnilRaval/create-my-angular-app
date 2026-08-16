import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { SIDEBAR_MENU } from '../../core/config/menu.config';
import { AuthStore } from '../../core/auth/auth.store';
import { SidebarStore } from '../sidebar.store';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, MatListModule, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  private readonly auth = inject(AuthStore);
  private readonly sidebar = inject(SidebarStore);
  readonly items = computed(() => {
    const role = this.auth.role();
    return SIDEBAR_MENU.filter((item) => !item.roles || (role && item.roles.includes(role)));
  });

  closeIfMobile(): void {
    if (this.sidebar.mobile()) {
      this.sidebar.close();
    }
  }
}
