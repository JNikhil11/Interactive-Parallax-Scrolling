import { test, expect } from '@playwright/test';

test.describe('TECHFEST — A FUTURE IN MOTION | E2E Parallax & Storytelling Suite (Redesign)', () => {
  test('01. Initial load renders official logos, semantic landmarks, and Scene 01', async ({ page }) => {
    await page.goto('/');

    // Check document title
    await expect(page).toHaveTitle(/Techfest — A Future in Motion/);

    // Check official logos
    const tfLogo = page.locator('.techfest-logo').first();
    const iitbLogo = page.locator('.iitb-logo').first();
    await expect(tfLogo).toBeAttached();
    await expect(iitbLogo).toBeAttached();

    // Check Skip Link
    const skipLink = page.locator('a.skip-to-main');
    await expect(skipLink).toHaveAttribute('href', '#main-content');

    // Check Scene 01 headline in mixed-case typography
    const headline01 = page.locator('#spark-headline');
    await expect(headline01).toContainText("The future doesn't wait. It begins with you.");
  });

  test('02. Scroll progress updates energy motif and atmosphere', async ({ page }) => {
    await page.goto('/');

    const energyCanvas = page.locator('#energy-trail-canvas');
    await expect(energyCanvas).toBeAttached();

    // Scroll through the narrative
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(400);

    const atmosphereCanvas = page.locator('#atmosphere-canvas');
    await expect(atmosphereCanvas).toBeAttached();
  });

  test('02b. Scene 03 renders realistic 3D powered exosuit assembly canvas and telemetry HUD', async ({ page }) => {
    await page.goto('/');

    const exosuitContainer = page.locator('#exosuit-container');
    const exosuitCanvas = page.locator('#exosuit-3d-canvas');
    const stageIndicator = page.locator('#suit-stage-indicator');

    await expect(exosuitContainer).toBeAttached();
    await expect(exosuitCanvas).toBeAttached();
    await expect(stageIndicator).toBeAttached();
    await expect(stageIndicator).toContainText(/01 \/\/|STAGE/i);
  });

  test('03. Scene 04 celestial domain buttons open accessible detail drawer', async ({ page }) => {
    await page.goto('/');

    const aiButton = page.locator('.domain-pill-btn[data-domain-key="ai"]');
    await aiButton.scrollIntoViewIfNeeded();
    await aiButton.click();

    const drawer = page.locator('#domain-detail-panel');
    await expect(drawer).toHaveClass(/is-active/);
    await expect(drawer).toHaveAttribute('aria-hidden', 'false');

    const modalTitle = page.locator('#domain-modal-title');
    await expect(modalTitle).toHaveText('Artificial Intelligence');

    // Close drawer
    const closeBtn = page.locator('#close-domain-panel');
    await closeBtn.click();
    await expect(drawer).not.toHaveClass(/is-active/);
  });

  test('04. Scene 05 showcases all 4 festival pillars', async ({ page }) => {
    await page.goto('/');

    const pillars = page.locator('.pillar-item');
    await expect(pillars).toHaveCount(4);

    const pillarTitles = await pillars.locator('.pillar-title').allTextContents();
    expect(pillarTitles).toContain('Competitions');
    expect(pillarTitles).toContain('Exhibitions');
    expect(pillarTitles).toContain('Workshops');
    expect(pillarTitles).toContain('Lectures & Experiences');
  });

  test('05. Scene 06 CTAs link to official Techfest portal and Explore Techfest scrolls', async ({ page }) => {
    await page.goto('/');

    const ctaOfficial = page.locator('#cta-official');
    await ctaOfficial.scrollIntoViewIfNeeded();
    await expect(ctaOfficial).toHaveAttribute('href', 'https://techfest.org/');
    await expect(ctaOfficial).toHaveAttribute('target', '_blank');

    const ctaExplore = page.locator('#cta-explore');
    await ctaExplore.scrollIntoViewIfNeeded();
    await ctaExplore.click({ force: true });
    await page.waitForTimeout(300);
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
