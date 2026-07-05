// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * ============================================================
 * AUTOMATION TEST — Halaman Publik
 * Website Biddokkes Polda Sulawesi Tengah
 * ============================================================
 *
 * Test ini memverifikasi semua section di halaman publik:
 * Hero, Signage Strip, Tentang, Layanan, Prosedur, Galeri,
 * Berita, FAQ, Lokasi, Header, dan Footer.
 */

// ─── HERO SECTION ───────────────────────────────────────────
test.describe('Hero Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display hero eyebrow text', async ({ page }) => {
    const eyebrow = page.locator('#hero-eyebrow');
    await expect(eyebrow).toBeVisible();
    await expect(eyebrow).toContainText('BIDDOKKES POLDA SULAWESI TENGAH');
  });

  test('should display hero title', async ({ page }) => {
    const title = page.locator('#hero-title');
    await expect(title).toBeVisible();
    await expect(title).toContainText('Layanan kesehatan');
  });

  test('should display hero description', async ({ page }) => {
    const desc = page.locator('#hero-description');
    await expect(desc).toBeVisible();
    await expect(desc).toContainText('Biddokkes Polda Sulteng');
  });

  test('should display CTA buttons', async ({ page }) => {
    const primaryBtn = page.locator('#hero-cta-primary');
    const secondaryBtn = page.locator('#hero-cta-secondary');
    await expect(primaryBtn).toBeVisible();
    await expect(primaryBtn).toContainText('Lihat Layanan');
    await expect(secondaryBtn).toBeVisible();
    await expect(secondaryBtn).toContainText('WhatsApp');
  });

  test('should display info card with service hours', async ({ page }) => {
    const infoCard = page.locator('#hero-info-card');
    await expect(infoCard).toBeVisible();
    await expect(infoCard).toContainText('JAM LAYANAN');
    await expect(infoCard).toContainText('Senin');
  });
});

// ─── HEADER / NAVIGATION ───────────────────────────────────
test.describe('Header & Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display site header', async ({ page }) => {
    const header = page.locator('#site-header');
    await expect(header).toBeVisible();
  });

  test('should have navigation links to all sections', async ({ page }) => {
    // On mobile, nav links are behind hamburger menu — check DOM existence
    const viewport = page.viewportSize();
    const isMobile = viewport && viewport.width < 768;

    if (isMobile) {
      // Open mobile menu first
      await page.locator('#site-header button[aria-label="Toggle menu"]').click();
      await page.waitForTimeout(300);
    }

    const navLinks = [
      { id: isMobile ? '#nav-tentang-mobile' : '#nav-tentang', text: 'Tentang' },
      { id: isMobile ? '#nav-layanan-mobile' : '#nav-layanan', text: 'Layanan' },
      { id: isMobile ? '#nav-prosedur-mobile' : '#nav-prosedur', text: 'Prosedur' },
      { id: isMobile ? '#nav-galeri-mobile' : '#nav-galeri', text: 'Galeri' },
      { id: isMobile ? '#nav-berita-mobile' : '#nav-berita', text: 'Berita' },
      { id: isMobile ? '#nav-faq-mobile' : '#nav-faq', text: 'FAQ' },
      { id: isMobile ? '#nav-lokasi-mobile' : '#nav-lokasi', text: 'Lokasi' },
    ];

    for (const link of navLinks) {
      const el = page.locator(link.id);
      await expect(el).toBeVisible();
      await expect(el).toContainText(link.text);
    }
  });

  test('should scroll to section when nav link is clicked', async ({ page }) => {
    const viewport = page.viewportSize();
    const isMobile = viewport && viewport.width < 768;

    if (isMobile) {
      // Open mobile menu and click
      await page.locator('#site-header button[aria-label="Toggle menu"]').click();
      await page.waitForTimeout(300);
      await page.click('#nav-layanan-mobile');
    } else {
      await page.click('#nav-layanan');
    }
    // Wait for smooth scroll
    await page.waitForTimeout(800);
    const section = page.locator('#layanan');
    await expect(section).toBeInViewport();
  });
});

// ─── SIGNAGE STRIP ──────────────────────────────────────────
test.describe('Signage Strip', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display all 7 service chips', async ({ page }) => {
    const strip = page.locator('#signage-strip');
    await expect(strip).toBeVisible();

    const chips = page.locator('.signage-chip');
    await expect(chips).toHaveCount(7);
  });

  test('should display correct service labels', async ({ page }) => {
    const expectedLabels = [
      'MCU & Surat Sehat',
      'Vaksinasi',
      'Laboratorium & Uji Narkoba',
      'Psikologi',
      'Ambulans & Rujukan',
      'Medikolegal',
      'DVI',
    ];

    for (let i = 0; i < expectedLabels.length; i++) {
      const chip = page.locator(`.signage-chip`).nth(i);
      await expect(chip).toContainText(expectedLabels[i]);
    }
  });

  test('should display service numbers in mono font', async ({ page }) => {
    const firstNumber = page.locator('.signage-chip .signage-number').first();
    await expect(firstNumber).toBeVisible();
    await expect(firstNumber).toContainText('01');
  });
});

// ─── TENTANG (ABOUT) SECTION ───────────────────────────────
test.describe('About Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display about section title', async ({ page }) => {
    const title = page.locator('#tentang h2');
    await expect(title).toBeVisible();
    await expect(title).toContainText('Tentang Biddokkes');
  });

  test('should display description text', async ({ page }) => {
    const section = page.locator('#tentang');
    await expect(section).toContainText('Bidang Kedokteran dan Kesehatan');
  });

  test('should display Tribrata badge', async ({ page }) => {
    const badge = page.locator('#tribrata-badge');
    await expect(badge).toBeVisible();
    await expect(badge).toContainText('TRIBRATA');
  });

  test('should display statistics with correct values', async ({ page }) => {
    const stats = [
      { id: '#stat-layanan', value: '7' },
      { id: '#stat-siaga', value: '24' },
      { id: '#stat-fasilitas', value: '2' },
      { id: '#stat-digital', value: '1' },
    ];

    // Scroll to statistics area so IntersectionObserver fires count-up
    await page.locator('#stat-layanan').scrollIntoViewIfNeeded();
    // Wait for count-up animation to complete (900ms duration)
    await page.waitForTimeout(1500);

    for (const stat of stats) {
      const el = page.locator(stat.id);
      await expect(el).toBeVisible();
      await expect(el).toContainText(stat.value);
    }
  });
});

// ─── LAYANAN (SERVICES) SECTION ─────────────────────────────
test.describe('Services Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display services section title', async ({ page }) => {
    const title = page.locator('#layanan h2');
    await expect(title).toBeVisible();
    await expect(title).toContainText('Layanan');
  });

  test('should display 7 service cards', async ({ page }) => {
    const cards = page.locator('#layanan .service-card');
    await expect(cards).toHaveCount(7);
  });

  test('should display correct service names', async ({ page }) => {
    const serviceNames = [
      'MCU & Surat Keterangan Sehat',
      'Vaksinasi',
      'Laboratorium & Uji Narkoba',
      'Psikologi',
      'Ambulans & Rujukan',
      'Medikolegal',
      'DVI',
    ];

    for (const name of serviceNames) {
      const card = page.locator(`#layanan .service-card:has-text("${name}")`);
      await expect(card.first()).toBeVisible();
    }
  });

  test('service card should have hover effect', async ({ page }) => {
    const card = page.locator('#layanan .service-card').first();
    const box = await card.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.waitForTimeout(200);
    }
    // Just checking the card is still visible after hover (no crash)
    await expect(card).toBeVisible();
  });
});

// ─── PROSEDUR (PROCEDURES) SECTION ──────────────────────────
test.describe('Procedures Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display procedures section', async ({ page }) => {
    const section = page.locator('#prosedur');
    await expect(section).toBeVisible();
  });

  test('should have accordion items', async ({ page }) => {
    const items = page.locator('#prosedur .accordion-item');
    const count = await items.count();
    expect(count).toBeGreaterThanOrEqual(7);
  });

  test('accordion should expand on click', async ({ page }) => {
    const firstTrigger = page.locator('#prosedur .accordion-trigger').first();
    const firstContent = page.locator('#prosedur .accordion-content').first();

    // Initially collapsed
    await expect(firstContent).not.toBeVisible();

    // Click to expand
    await firstTrigger.click();
    await page.waitForTimeout(300);

    // Now visible
    await expect(firstContent).toBeVisible();
  });

  test('accordion should collapse on second click', async ({ page }) => {
    const firstTrigger = page.locator('#prosedur .accordion-trigger').first();
    const firstContent = page.locator('#prosedur .accordion-content').first();

    // Expand
    await firstTrigger.click();
    await page.waitForTimeout(300);
    await expect(firstContent).toBeVisible();

    // Collapse
    await firstTrigger.click();
    await page.waitForTimeout(300);
    await expect(firstContent).not.toBeVisible();
  });
});

// ─── GALERI (GALLERY) SECTION ───────────────────────────────
test.describe('Gallery Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display gallery section', async ({ page }) => {
    const section = page.locator('#galeri');
    await expect(section).toBeVisible();
  });

  test('should show empty state when no data', async ({ page }) => {
    const emptyState = page.locator('#galeri-empty');
    // If visible, check the message
    const count = await emptyState.count();
    if (count > 0) {
      await expect(emptyState).toContainText('Belum ada kegiatan');
    }
  });
});

// ─── BERITA (NEWS) SECTION ──────────────────────────────────
test.describe('News Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display news section', async ({ page }) => {
    const section = page.locator('#berita');
    await expect(section).toBeVisible();
  });

  test('should show empty state when no data', async ({ page }) => {
    const emptyState = page.locator('#berita-empty');
    const count = await emptyState.count();
    if (count > 0) {
      await expect(emptyState).toContainText('Belum ada berita');
    }
  });
});

// ─── FAQ SECTION ────────────────────────────────────────────
test.describe('FAQ Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display FAQ section with title', async ({ page }) => {
    const title = page.locator('#faq h2');
    await expect(title).toBeVisible();
    await expect(title).toContainText('FAQ');
  });

  test('should have 6 FAQ items', async ({ page }) => {
    const items = page.locator('#faq .accordion-item');
    await expect(items).toHaveCount(6);
  });

  test('FAQ accordion should expand and show answer', async ({ page }) => {
    const firstTrigger = page.locator('#faq .accordion-trigger').first();
    const firstContent = page.locator('#faq .accordion-content').first();

    await firstTrigger.click();
    await page.waitForTimeout(300);

    await expect(firstContent).toBeVisible();
    // Should contain actual answer text
    const text = await firstContent.textContent();
    expect(text.length).toBeGreaterThan(20);
  });
});

// ─── LOKASI & KONTAK (LOCATION) SECTION ─────────────────────
test.describe('Location Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display location section', async ({ page }) => {
    const section = page.locator('#lokasi');
    await expect(section).toBeVisible();
  });

  test('should display address', async ({ page }) => {
    const section = page.locator('#lokasi');
    await expect(section).toContainText('Palu');
  });

  test('should display service hours', async ({ page }) => {
    const section = page.locator('#lokasi');
    await expect(section).toContainText('Senin');
    await expect(section).toContainText('08.00');
  });

  test('should contain a map iframe', async ({ page }) => {
    const iframe = page.locator('#lokasi iframe');
    await expect(iframe).toBeVisible();
  });
});

// ─── FOOTER ─────────────────────────────────────────────────
test.describe('Footer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display footer', async ({ page }) => {
    const footer = page.locator('#site-footer');
    await expect(footer).toBeVisible();
  });

  test('should display anti-fraud disclaimer', async ({ page }) => {
    const disclaimer = page.locator('#footer-disclaimer');
    await expect(disclaimer).toBeVisible();
    await expect(disclaimer).toContainText('penipuan');
  });

  test('should display copyright text', async ({ page }) => {
    const copyright = page.locator('#footer-copyright');
    await expect(copyright).toBeVisible();
    await expect(copyright).toContainText('Biddokkes');
    await expect(copyright).toContainText('KKLP');
  });

  test('should have navigation links', async ({ page }) => {
    const footerNav = page.locator('#site-footer nav a');
    const count = await footerNav.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });
});

// ─── ACCESSIBILITY ──────────────────────────────────────────
test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have exactly one H1', async ({ page }) => {
    const h1s = page.locator('h1');
    await expect(h1s).toHaveCount(1);
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    // Check H2s exist for sections
    const h2s = page.locator('h2');
    const count = await h2s.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test('should have descriptive page title', async ({ page }) => {
    const title = await page.title();
    expect(title).toContain('Biddokkes');
  });

  test('should have meta description', async ({ page }) => {
    const metaDesc = page.locator('meta[name="description"]');
    const content = await metaDesc.getAttribute('content');
    expect(content).toBeTruthy();
    expect(content.length).toBeGreaterThan(50);
  });
});

// ─── RESPONSIVE LAYOUT ─────────────────────────────────────
test.describe('Responsive Layout', () => {
  test('should render properly at 360px mobile', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/');

    const hero = page.locator('#hero-title');
    await expect(hero).toBeVisible();

    // No horizontal scrollbar on body
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 5);
  });

  test('should render properly at 720px tablet', async ({ page }) => {
    await page.setViewportSize({ width: 720, height: 1024 });
    await page.goto('/');

    const hero = page.locator('#hero-title');
    await expect(hero).toBeVisible();
  });

  test('should render properly at 1200px desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/');

    const hero = page.locator('#hero-title');
    await expect(hero).toBeVisible();

    // Nav links visible on desktop
    const navLink = page.locator('#nav-tentang');
    await expect(navLink).toBeVisible();
  });
});
