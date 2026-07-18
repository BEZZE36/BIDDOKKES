# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin-flow.spec.js >> Admin Login Page >> should display login button
- Location: tests\admin-flow.spec.js:40:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('#admin-login-btn')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('#admin-login-btn')

```

```yaml
- alert
```

# Test source

```ts
  1   | // @ts-check
  2   | const { test, expect } = require('@playwright/test');
  3   | 
  4   | /**
  5   |  * ============================================================
  6   |  * AUTOMATION TEST — Alur Admin
  7   |  * Website Biddokkes Polda Sulawesi Tengah
  8   |  * ============================================================
  9   |  *
  10  |  * Test ini memverifikasi:
  11  |  * - Halaman login admin muncul dengan benar
  12  |  * - Validasi form login
  13  |  * - Proteksi halaman dashboard (redirect jika belum login)
  14  |  * - Elemen UI panel admin
  15  |  */
  16  | 
  17  | // ─── ADMIN LOGIN PAGE ───────────────────────────────────────
  18  | test.describe('Admin Login Page', () => {
  19  |   test.beforeEach(async ({ page }) => {
  20  |     await page.goto('/admin');
  21  |   });
  22  | 
  23  |   test('should display login page', async ({ page }) => {
  24  |     const heading = page.locator('h1, h2').filter({ hasText: /login|masuk|admin/i });
  25  |     await expect(heading.first()).toBeVisible();
  26  |   });
  27  | 
  28  |   test('should display email input field', async ({ page }) => {
  29  |     const emailInput = page.locator('#admin-email');
  30  |     await expect(emailInput).toBeVisible();
  31  |     await expect(emailInput).toHaveAttribute('type', 'email');
  32  |   });
  33  | 
  34  |   test('should display password input field', async ({ page }) => {
  35  |     const passwordInput = page.locator('#admin-password');
  36  |     await expect(passwordInput).toBeVisible();
  37  |     await expect(passwordInput).toHaveAttribute('type', 'password');
  38  |   });
  39  | 
  40  |   test('should display login button', async ({ page }) => {
  41  |     const loginBtn = page.locator('#admin-login-btn');
> 42  |     await expect(loginBtn).toBeVisible();
      |                            ^ Error: expect(locator).toBeVisible() failed
  43  |     await expect(loginBtn).toBeEnabled();
  44  |   });
  45  | 
  46  |   test('should show error on empty form submission', async ({ page }) => {
  47  |     const loginBtn = page.locator('#admin-login-btn');
  48  |     await loginBtn.click();
  49  |     await page.waitForTimeout(500);
  50  | 
  51  |     // Browser native validation or custom error
  52  |     const emailInput = page.locator('#admin-email');
  53  |     const isInvalid = await emailInput.evaluate(
  54  |       (el) => !/** @type {HTMLInputElement} */(el).checkValidity()
  55  |     );
  56  |     expect(isInvalid).toBe(true);
  57  |   });
  58  | 
  59  |   test('should show error on invalid credentials', async ({ page }) => {
  60  |     await page.fill('#admin-email', 'wrong@test.com');
  61  |     await page.fill('#admin-password', 'wrongpassword');
  62  |     await page.click('#admin-login-btn');
  63  | 
  64  |     // Wait for error response
  65  |     await page.waitForTimeout(2000);
  66  | 
  67  |     const errorMsg = page.locator('#admin-login-error');
  68  |     // Only check if error appears (depends on Supabase connection)
  69  |     const count = await errorMsg.count();
  70  |     if (count > 0) {
  71  |       await expect(errorMsg).toBeVisible();
  72  |     }
  73  |   });
  74  | });
  75  | 
  76  | // ─── ADMIN DASHBOARD PROTECTION ─────────────────────────────
  77  | test.describe('Admin Dashboard Protection', () => {
  78  |   test('should redirect to login when accessing dashboard without auth', async ({ page }) => {
  79  |     await page.goto('/admin/dashboard');
  80  |     await page.waitForTimeout(2000);
  81  | 
  82  |     // Should redirect to /admin login or show login form
  83  |     const url = page.url();
  84  |     const hasLoginForm = await page.locator('#admin-email').count();
  85  |     const isOnAdmin = url.includes('/admin') && !url.includes('/dashboard');
  86  |     const showsLoginPrompt = hasLoginForm > 0;
  87  | 
  88  |     expect(isOnAdmin || showsLoginPrompt).toBe(true);
  89  |   });
  90  | });
  91  | 
  92  | // ─── ADMIN UI ELEMENTS (structure check) ────────────────────
  93  | test.describe('Admin UI Structure', () => {
  94  |   test('admin login form should have Biddokkes branding', async ({ page }) => {
  95  |     await page.goto('/admin');
  96  | 
  97  |     const page_content = await page.textContent('body');
  98  |     expect(page_content).toContain('Biddokkes');
  99  |   });
  100 | 
  101 |   test('admin page should have proper title', async ({ page }) => {
  102 |     await page.goto('/admin');
  103 |     const title = await page.title();
  104 |     expect(title.toLowerCase()).toMatch(/admin|biddokkes/);
  105 |   });
  106 | });
  107 | 
  108 | // ─── ADMIN PAGE RESPONSIVE ─────────────────────────────────
  109 | test.describe('Admin Responsive', () => {
  110 |   test('login form should be usable at 360px', async ({ page }) => {
  111 |     await page.setViewportSize({ width: 360, height: 800 });
  112 |     await page.goto('/admin');
  113 | 
  114 |     const emailInput = page.locator('#admin-email');
  115 |     const passwordInput = page.locator('#admin-password');
  116 |     const loginBtn = page.locator('#admin-login-btn');
  117 | 
  118 |     await expect(emailInput).toBeVisible();
  119 |     await expect(passwordInput).toBeVisible();
  120 |     await expect(loginBtn).toBeVisible();
  121 |   });
  122 | });
  123 | 
```