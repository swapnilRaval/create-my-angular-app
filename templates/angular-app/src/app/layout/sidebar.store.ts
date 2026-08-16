import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SidebarStore {
  readonly opened = signal(false);
  readonly mobile = signal(false);

  open(): void {
    this.opened.set(true);
  }

  close(): void {
    this.opened.set(false);
  }

  toggle(): void {
    this.opened.update((value) => !value);
  }

  setMobile(value: boolean): void {
    this.mobile.set(value);
    if (!value) {
      this.opened.set(false);
    }
  }
}
