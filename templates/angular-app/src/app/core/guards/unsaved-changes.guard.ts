import { CanDeactivateFn } from '@angular/router';

export interface CanLeave {
  canLeave(): boolean;
}

export const unsavedChangesGuard: CanDeactivateFn<CanLeave> = (component) => {
  if (!component.canLeave || component.canLeave()) {
    return true;
  }
  return window.confirm('You have unsaved changes. Leave this page?');
};
