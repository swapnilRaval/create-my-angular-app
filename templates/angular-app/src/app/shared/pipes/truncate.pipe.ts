import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
})
export class TruncatePipe implements PipeTransform {
  transform(value: string | null | undefined, limit = 80): string {
    const text = value ?? '';
    return text.length > limit ? `${text.slice(0, limit).trimEnd()}…` : text;
  }
}
