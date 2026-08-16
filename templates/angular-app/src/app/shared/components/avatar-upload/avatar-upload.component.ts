import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-avatar-upload',
  imports: [MatButtonModule],
  template: `
    <div class="avatar">
      @if (preview()) {
        <img [src]="preview()!" [alt]="name() + ' photo preview'" />
      } @else {
        <span>{{ initials() }}</span>
      }
    </div>
    <button mat-stroked-button type="button" (click)="input.click()">Change photo</button>
    <input #input type="file" accept="image/png,image/jpeg,image/webp" hidden (change)="onSelect(input.files)" />
  `,
  styles: `
    .avatar {
      width: 88px;
      height: 88px;
      border-radius: 50%;
      overflow: hidden;
      display: grid;
      place-items: center;
      background: var(--mat-sys-surface-container);
      margin-bottom: 0.75rem;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarUploadComponent {
  readonly name = input('User');
  readonly fileSelected = output<File>();
  readonly preview = signal<string | null>(null);

  initials(): string {
    return this.name()
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('');
  }

  onSelect(list: FileList | null): void {
    const file = list?.item(0);
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      return;
    }
    this.preview.set(URL.createObjectURL(file));
    this.fileSelected.emit(file);
  }
}
