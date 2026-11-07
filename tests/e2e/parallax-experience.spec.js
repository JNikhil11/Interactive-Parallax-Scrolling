import { test, expect } from '@playwright/test';

test.describe('TECHFEST — A FUTURE IN MOTION | E2E Parallax & Interaction Suite', () => {
  test('01. Initial load renders official logos, semantic landmarks, and Scene 01', async ({ page }) => {
    await page.goto('/');

    // Check document title
    await expect(page).toHaveTitle(/TECHFEST — A FUTURE IN MOTION/);

    // Check official logos
    const tfLogo = page.locator('.techfest-logo').first();
    const iitbLogo = page.locator('.iitb-logo').first();
    await expect(tfLogo).toBeVisible();
    await expect(iitbLogo).toBeVisible();

    // Check Skip Link
    const skipLink = page.locator('a.skip-to-main');
    await expect(skipLink).toHaveAttribute('href', '#main-content');

    // Check Scene 01 headline
    const headline01 = page.locator('#spark-headline');
    await expect(headline01).toContainText("THE FUTURE DOESN'T WAIT. IT BEGINS WITH YOU.");
  });

  test('02. Scroll progress updates Chapter HUD and progress fill bar', async ({ page }) => {
    await page.goto('/');

    const progressFill = page.locator('#hud-progress-fill');
    await expect(progressFill).toBeVisible();

    // Scroll to middle of document
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(300);

    const styleTransform = await progressFill.evaluate((el) => el.style.transform);
    expect(styleTransform).toContain('scaleY');
  });

  test('03. Scene 04 domain buttons open accessible detail drawer', async ({ page }) => {
    await page.goto('/');

    const aiButton = page.locator('.domain-node[data-domain-key="ai"]');
    await aiButton.scrollIntoViewIfNeeded();
    await aiButton.click();

    const drawer = page.locator('#domain-detail-panel');
    await expect(drawer).toHaveClass(/is-active/);
    await expect(drawer).toHaveAttribute('aria-hidden', 'false');

    const modalTitle = page.locator('#domain-modal-title');
    await expect(modalTitle).toHaveText('Artificial Intelligence');

    // Close with close button
    const closeBtn = page.locator('#close-domain-panel');
    await closeBtn.click();
    await expect(drawer).not.toHaveClass(/is-active/);
  });

  test('04. Scene 05 experience cards render all 4 pillars', async ({ page }) => {
    await page.goto('/');

    const cards = page.locator('.experience-card');
    await expect(cards).toHaveCount(4);

    const cardTitles = await cards.locator('.card-title').allTextContents();
    expect(cardTitles).toContain('Competitions');
    expect(cardTitles).toContain('Exhibitions');
    expect(cardTitles).toContain('Workshops');
    expect(cardTitles).toContain('Lectures & Experiences');
  });

  test('05. Scene 06 CTAs link to official Techfest portal and trigger Quick-Explorer', async ({ page }) => {
    await page.goto('/');

    const ctaOfficial = page.locator('#cta-official');
    await ctaOfficial.scrollIntoViewIfNeeded();
    await expect(ctaOfficial).toHaveAttribute('href', 'https://techfest.org/');
    await expect(ctaOfficial).toHaveAttribute('target', '_blank');

    // Test Quick Explorer
    const ctaExplore = page.locator('#cta-explore');
    await ctaExplore.click();

    const explorerOverlay = page.locator('#explorer-overlay');
    await expect(explorerOverlay).toHaveClass(/is-active/);

    const closeExplorer = page.locator('#close-explorer');
    await closeExplorer.click();
    await expect(explorerOverlay).not.toHaveClass(/is-active/);
  });

  test('06. Reduced motion toggle updates root attribute and button state', async ({ page }) => {
    await page.goto('/');

    const toggleBtn = page.locator('#toggle-motion-btn');
    await toggleBtn.click();

    const rootAttr = await page.evaluate(() => document.documentElement.getAttribute('data-reduced-motion'));
    expect(rootAttr).toBe('true');
    await expect(toggleBtn).toHaveAttribute('aria-pressed', 'true');
  });

  test('07. Viewport responsive check ensures zero horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(hasHorizontalOverflow).toBe(false);
  });
});
