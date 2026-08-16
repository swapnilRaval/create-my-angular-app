import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatChip } from '@angular/material/chips';

@Component({
  selector: 'app-status-chip',
  imports: [MatChip],
  template: `<mat-chip [highlighted]="active()">{{ active() ? 'Active' : 'Inactive' }}</mat-chip>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppStatusChipComponent {
  readonly active = input(true);
}
