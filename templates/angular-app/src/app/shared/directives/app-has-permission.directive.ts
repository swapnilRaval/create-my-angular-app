import { Directive, TemplateRef, ViewContainerRef, effect, inject, input } from '@angular/core';
import { AuthStore } from '../../core/auth/auth.store';
import { Permission, ROLE_PERMISSIONS } from '../../core/models/user.model';

@Directive({
  selector: '[appHasPermission]',
})
export class AppHasPermissionDirective {
  private readonly store = inject(AuthStore);
  private readonly template = inject(TemplateRef<unknown>);
  private readonly view = inject(ViewContainerRef);
  readonly appHasPermission = input.required<Permission | Permission[]>();

  constructor() {
    effect(() => {
      const required = this.appHasPermission();
      const role = this.store.role();
      const granted = role ? ROLE_PERMISSIONS[role] : [];
      const needed = Array.isArray(required) ? required : [required];
      this.view.clear();
      if (needed.every((permission) => granted.includes(permission))) {
        this.view.createEmbeddedView(this.template);
      }
    });
  }
}
