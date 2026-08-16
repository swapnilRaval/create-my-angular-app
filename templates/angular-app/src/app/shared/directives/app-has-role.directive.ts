import { Directive, TemplateRef, ViewContainerRef, effect, inject, input } from '@angular/core';
import { AuthStore } from '../../core/auth/auth.store';
import { UserRole } from '../../core/models/user.model';

@Directive({
  selector: '[appHasRole]',
})
export class AppHasRoleDirective {
  private readonly template = inject(TemplateRef<unknown>);
  private readonly view = inject(ViewContainerRef);
  private readonly auth = inject(AuthStore);
  readonly appHasRole = input.required<UserRole | UserRole[]>();

  constructor() {
    effect(() => {
      const allowed = this.appHasRole();
      const list = Array.isArray(allowed) ? allowed : [allowed];
      const role = this.auth.role();
      this.view.clear();
      if (role && list.includes(role)) {
        this.view.createEmbeddedView(this.template);
      }
    });
  }
}
