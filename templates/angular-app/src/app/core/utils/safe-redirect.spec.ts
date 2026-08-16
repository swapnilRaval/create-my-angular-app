import { isSafeRedirect, resolveReturnUrl } from './safe-redirect';

describe('safe-redirect', () => {
  it('accepts same-origin relative paths', () => {
    expect(isSafeRedirect('/dashboard')).toBe(true);
    expect(isSafeRedirect('/users/1?tab=profile')).toBe(true);
  });

  it('rejects open redirects', () => {
    expect(isSafeRedirect('https://evil.example')).toBe(false);
    expect(isSafeRedirect('//evil.example')).toBe(false);
    expect(isSafeRedirect('\\evil')).toBe(false);
    expect(isSafeRedirect(null)).toBe(false);
  });

  it('falls back when the returnUrl is unsafe', () => {
    expect(resolveReturnUrl('https://evil.example')).toBe('/dashboard');
    expect(resolveReturnUrl('/profile')).toBe('/profile');
  });
});
