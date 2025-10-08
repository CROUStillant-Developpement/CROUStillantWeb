import { test, expect } from '@playwright/test';

test('homepage has site title or logo', async ({ page }) => {
  await page.goto('http://localhost:3000');
  // Check for site title text or logo
  const hasTitle = await page.locator('text=CROUStillant').first().count();
  const hasLogo = await page.locator('img[alt="CROUStillant logo"]').first().count();
  expect(hasTitle + hasLogo).toBeGreaterThan(0);
});
