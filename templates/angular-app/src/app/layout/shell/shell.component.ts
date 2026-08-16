import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FooterComponent } from '../footer/footer.component';
import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs.component';
import { LoadingService } from '../../core/services/loading.service';
import { SidebarStore } from '../sidebar.store';

@Component({
  selector: 'app-shell',
  imports: [
    RouterOutlet,
    MatSidenavModule,
    MatProgressBarModule,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    BreadcrumbsComponent,
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent {
  readonly loading = inject(LoadingService);
  readonly sidebar = inject(SidebarStore);
}
