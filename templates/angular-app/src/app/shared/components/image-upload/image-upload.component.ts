import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FileUploadComponent } from '../file-upload/file-upload.component';

@Component({
  selector: 'app-image-upload',
  imports: [FileUploadComponent],
  template: `
    <app-file-upload
      accept="image/png,image/jpeg,image/webp"
      [multiple]="multiple()"
      [maxSizeBytes]="maxSizeBytes()"
      [endpoint]="endpoint()"
      (filesChange)="filesChange.emit($event)"
      (uploaded)="uploaded.emit($event)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageUploadComponent {
  readonly multiple = input(false);
  readonly maxSizeBytes = input(2 * 1024 * 1024);
  readonly endpoint = input<string | null>(null);
  readonly filesChange = output<File[]>();
  readonly uploaded = output<unknown>();
}
