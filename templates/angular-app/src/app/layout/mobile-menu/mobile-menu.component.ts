import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { SidebarStore } from '../sidebar.store';

@Component({
  selector: 'app-mobile-menu',
  imports: [SidebarComponent],
  template: `
    @if (sidebar.mobile()) {
      <app-sidebar />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileMenuComponent {
  readonly sidebar = inject(SidebarStore);
}
