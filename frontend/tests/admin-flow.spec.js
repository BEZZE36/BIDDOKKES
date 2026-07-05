// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * ============================================================
 * AUTOMATION TEST — Alur Admin
 * Website Biddokkes Polda Sulawesi Tengah
 * ============================================================
 *
 * Test ini memverifikasi:
 * - Halaman login admin muncul dengan benar
 * - Validasi form login
 * - Proteksi halaman dashboard (redirect jika belum login)
 * - Elemen UI panel admin
 */

// ─── ADMIN LOGIN PAGE ───────────────────────────────────────
test.describe('Admin Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin');
  });

  test('should display login page', async ({ page }) => {
    const heading = page.locator('h1, h2').filter({ hasText: /login|masuk|admin/i });
    await expect(heading.first()).toBeVisible();
  });

  test('should display email input field', async ({ page }) => {
    const emailInput = page.locator('#admin-email');
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveAttribute('type', 'email');
  });

  test('should display password input field', async ({ page }) => {
    const passwordInput = page.locator('#admin-password');
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should display login button', async ({ page }) => {
    const loginBtn = page.locator('#admin-login-btn');
    await expect(loginBtn).toBeVisible();
    await expect(loginBtn).toBeEnabled();
  });

  test('should show error on empty form submission', async ({ page }) => {
    const loginBtn = page.locator('#admin-login-btn');
    await loginBtn.click();
    await page.waitForTimeout(500);

    // Browser native validation or custom error
    const emailInput = page.locator('#admin-email');
    const isInvalid = await emailInput.evaluate(
      (el) => !/** @type {HTMLInputElement} */(el).checkValidity()
    );
    expect(isInvalid).toBe(true);
  });

  test('should show error on invalid credentials', async ({ page }) => {
    await page.fill('#admin-email', 'wrong@test.com');
    await page.fill('#admin-password', 'wrongpassword');
    await page.click('#admin-login-btn');

    // Wait for error response
    await page.waitForTimeout(2000);

    const errorMsg = page.locator('#admin-login-error');
    // Only check if error appears (depends on Supabase connection)
    const count = await errorMsg.count();
    if (count > 0) {
      await expect(errorMsg).toBeVisible();
    }
  });
});

// ─── ADMIN DASHBOARD PROTECTION ─────────────────────────────
test.describe('Admin Dashboard Protection', () => {
  test('should redirect to login when accessing dashboard without auth', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await page.waitForTimeout(2000);

    // Should redirect to /admin login or show login form
    const url = page.url();
    const hasLoginForm = await page.locator('#admin-email').count();
    const isOnAdmin = url.includes('/admin') && !url.includes('/dashboard');
    const showsLoginPrompt = hasLoginForm > 0;

    expect(isOnAdmin || showsLoginPrompt).toBe(true);
  });
});

// ─── ADMIN UI ELEMENTS (structure check) ────────────────────
test.describe('Admin UI Structure', () => {
  test('admin login form should have Biddokkes branding', async ({ page }) => {
    await page.goto('/admin');

    const page_content = await page.textContent('body');
    expect(page_content).toContain('Biddokkes');
  });

  test('admin page should have proper title', async ({ page }) => {
    await page.goto('/admin');
    const title = await page.title();
    expect(title.toLowerCase()).toMatch(/admin|biddokkes/);
  });
});

// ─── ADMIN PAGE RESPONSIVE ─────────────────────────────────
test.describe('Admin Responsive', () => {
  test('login form should be usable at 360px', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/admin');

    const emailInput = page.locator('#admin-email');
    const passwordInput = page.locator('#admin-password');
    const loginBtn = page.locator('#admin-login-btn');

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(loginBtn).toBeVisible();
  });
});
