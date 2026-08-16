import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusLabel',
})
export class StatusLabelPipe implements PipeTransform {
  transform(active: boolean | null | undefined): string {
    return active ? 'Active' : 'Inactive';
  }
}
