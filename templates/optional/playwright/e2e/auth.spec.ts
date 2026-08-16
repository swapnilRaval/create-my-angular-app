import { expect, test } from '@playwright/test';

test('login page is reachable', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByText('Sign in').first()).toBeVisible();
});

test('protected dashboard redirects guests', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/\/login/);
});
