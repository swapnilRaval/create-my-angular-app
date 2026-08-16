import { Directive, ElementRef, inject, output } from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
  host: {
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class AppClickOutsideDirective {
  private readonly host = inject(ElementRef<HTMLElement>);
  readonly appClickOutside = output<MouseEvent>();

  onDocumentClick(event: MouseEvent): void {
    const target = event.target;
    if (target instanceof Node && !this.host.nativeElement.contains(target)) {
      this.appClickOutside.emit(event);
    }
  }
}
