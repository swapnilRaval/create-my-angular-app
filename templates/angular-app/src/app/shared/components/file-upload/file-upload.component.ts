import { HttpEventType } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { ApiClientService } from '../../../core/api/api-client.service';
import { FileSizePipe } from '../../pipes/file-size.pipe';

export interface SelectedFile {
  file: File;
  previewUrl?: string;
}

@Component({
  selector: 'app-file-upload',
  imports: [MatButtonModule, MatProgressBarModule, MatIconModule, FileSizePipe],
  template: `
    <div
      class="dropzone"
      [class.active]="dragOver()"
      (dragover)="onDragOver($event)"
      (dragleave)="dragOver.set(false)"
      (drop)="onDrop($event)"
    >
      <p>Drop files here or</p>
      <button mat-stroked-button type="button" (click)="input.click()">Browse</button>
      <input
        #input
        type="file"
        hidden
        [accept]="accept()"
        [multiple]="multiple()"
        (change)="onInput(input.files)"
      />
    </div>

    @if (error()) {
      <p class="error" role="alert">{{ error() }}</p>
    }

    <ul>
      @for (item of files(); track item.file.name) {
        <li>
          <span>{{ item.file.name }} ({{ item.file.size | fileSize }})</span>
          <button mat-icon-button type="button" aria-label="Remove file" (click)="remove(item.file)">
            <mat-icon>close</mat-icon>
          </button>
        </li>
      }
    </ul>

    @if (progress() !== null) {
      <mat-progress-bar mode="determinate" [value]="progress()!" />
      <button mat-button type="button" (click)="cancel()">Cancel upload</button>
    }

    @if (endpoint() && files().length) {
      <button mat-flat-button type="button" (click)="upload()" [disabled]="progress() !== null">
        Upload
      </button>
    }
  `,
  styles: `
    .dropzone {
      border: 1px dashed var(--mat-sys-outline);
      border-radius: 12px;
      padding: 1.5rem;
      text-align: center;
    }
    .dropzone.active {
      border-color: var(--mat-sys-primary);
    }
    .error {
      color: var(--mat-sys-error);
    }
    ul {
      list-style: none;
      padding: 0;
    }
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploadComponent {
  private readonly api = inject(ApiClientService);
  readonly accept = input('image/*,.pdf');
  readonly multiple = input(false);
  readonly maxSizeBytes = input(5 * 1024 * 1024);
  readonly endpoint = input<string | null>(null);
  readonly filesChange = output<File[]>();
  readonly uploaded = output<unknown>();
  readonly files = signal<SelectedFile[]>([]);
  readonly dragOver = signal(false);
  readonly error = signal<string | null>(null);
  readonly progress = signal<number | null>(null);
  private uploadSub: Subscription | null = null;

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragOver.set(true);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragOver.set(false);
    this.addFiles(event.dataTransfer?.files);
  }

  onInput(list: FileList | null): void {
    this.addFiles(list);
  }

  remove(file: File): void {
    this.files.update((current) => current.filter((item) => item.file !== file));
    this.emitFiles();
  }

  cancel(): void {
    this.uploadSub?.unsubscribe();
    this.uploadSub = null;
    this.progress.set(null);
  }

  upload(): void {
    const path = this.endpoint();
    if (!path) return;
    const body = new FormData();
    for (const item of this.files()) {
      body.append(this.multiple() ? 'files' : 'file', item.file);
    }
    this.progress.set(0);
    this.uploadSub = this.api.uploadEvents(path, body).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.progress.set(Math.round((100 * event.loaded) / event.total));
        }
        if (event.type === HttpEventType.Response) {
          this.progress.set(null);
          this.uploaded.emit(event.body);
        }
      },
      error: () => {
        this.progress.set(null);
        this.error.set('Upload failed. Check the file and try again.');
      },
    });
  }

  private addFiles(list: FileList | null | undefined): void {
    if (!list) return;
    const next = this.multiple() ? [...this.files()] : [];
    for (const file of Array.from(list)) {
      if (file.size > this.maxSizeBytes()) {
        this.error.set(`${file.name} is larger than the allowed size.`);
        continue;
      }
      if (!this.isAccepted(file)) {
        this.error.set(`${file.name} is not an accepted file type.`);
        continue;
      }
      next.push({ file, previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined });
    }
    this.files.set(next);
    this.emitFiles();
  }

  private isAccepted(file: File): boolean {
    const accept = this.accept();
    if (!accept || accept === '*/*') return true;
    return accept.split(',').some((rule) => {
      const value = rule.trim();
      if (value.endsWith('/*')) {
        return file.type.startsWith(value.replace('/*', '/'));
      }
      if (value.startsWith('.')) {
        return file.name.toLowerCase().endsWith(value.toLowerCase());
      }
      return file.type === value;
    });
  }

  private emitFiles(): void {
    this.filesChange.emit(this.files().map((item) => item.file));
  }
}
