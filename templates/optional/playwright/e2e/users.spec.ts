import { expect, test } from '@playwright/test';

test('users list requires authentication', async ({ page }) => {
  await page.goto('/users');
  await expect(page).toHaveURL(/\/login/);
});
