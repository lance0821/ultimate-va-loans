import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should allow a user to register, logout, and login again', async ({ page }) => {
    // Use a unique email for each test run to avoid conflicts
    const userEmail = `testuser_${Date.now()}@example.com`;
    const userPassword = 'password123';

    // --- 1. Registration ---
    await page.goto('/register');
    await expect(page).toHaveTitle(/Next-Gen VA Loans/);

    await page.getByLabel('Email').fill(userEmail);
    await page.getByLabel(/^Password$/i).fill(userPassword);
    await page.getByLabel('Confirm Password').fill(userPassword);
    await page.getByRole('button', { name: 'Create Account' }).click();

    // --- 2. Verify Dashboard after Registration ---
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText(`Welcome, ${userEmail}!`)).toBeVisible();

    // --- 3. Logout ---
    await page.getByRole('button', { name: 'Logout' }).click();
    await expect(page).toHaveURL('/login');

    // --- 4. Login ---
    await page.getByLabel('Email').fill(userEmail);
    await page.getByLabel('Password').fill(userPassword);
    await page.getByRole('button', { name: 'Sign In' }).click();

    // --- 5. Verify Dashboard after Login ---
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText(`Welcome, ${userEmail}!`)).toBeVisible();
  });
});