export function isSafeRedirect(target: string | null | undefined): target is string {
  if (!target) return false;
  if (!target.startsWith('/')) return false;
  if (target.startsWith('//')) return false;
  if (target.includes('\\')) return false;
  return true;
}

export function resolveReturnUrl(value: string | null | undefined, fallback = '/dashboard'): string {
  return isSafeRedirect(value) ? value : fallback;
}
