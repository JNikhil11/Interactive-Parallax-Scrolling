import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

describe('DOM & Semantic HTML5 Integrity Verification (Redesign)', () => {
  const htmlPath = path.resolve(__dirname, '../../index.html');
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');
  const dom = new JSDOM(htmlContent);
  const { document } = dom.window;

  it('contains the 6 headlines in mixed-case editorial typography', () => {
    const headlines = [
      "The future doesn't wait. It begins with you.",
      'Before the invention, there was an idea.',
      'Ideas are nothing without the courage to build.',
      'There are no finish lines to human curiosity.',
      'Where the world comes to build tomorrow.',
      'The next revolution needs you.',
    ];

    const h1 = document.querySelector('h1#spark-headline');
    expect(h1).not.toBeNull();
    expect(h1.textContent.replace(/\s+/g, ' ').trim()).toBe(headlines[0]);

    const h2Elements = Array.from(document.querySelectorAll('h2.editorial-headline'));
    expect(h2Elements.length).toBe(5);
    for (let i = 1; i <= 5; i++) {
      expect(h2Elements[i - 1].textContent.replace(/\s+/g, ' ').trim()).toBe(headlines[i]);
    }
  });

  it('contains the exact subtexts for all 6 scenes', () => {
    const expectedSubtexts = [
      'Every extraordinary invention begins with an extraordinary question.',
      'Curiosity transforms possibilities into plans. Imagination gives technology its first shape.',
      'From the first prototype to complex machines, engineering turns imagination into reality.',
      'From artificial intelligence to robotics, aerospace and emerging sciences, the next frontier is waiting to be explored.',
      'Ideas become more powerful when minds meet. Experience the energy of competitions, demonstrations, exhibitions and learning.',
      "Don't just witness the future. Become part of the people creating it.",
    ];

    const subtexts = Array.from(document.querySelectorAll('.editorial-subtext'));
    expect(subtexts.length).toBe(6);
    expectedSubtexts.forEach((expected, idx) => {
      expect(subtexts[idx].textContent.trim()).toBe(expected);
    });
  });

  it('contains both official Techfest and IIT Bombay logos in header and footer', () => {
    const techfestLogos = Array.from(document.querySelectorAll('img[src*="techfest-logo.png"]'));
    const iitbLogos = Array.from(document.querySelectorAll('img[src*="iitb-logo.png"]'));

    expect(techfestLogos.length).toBeGreaterThanOrEqual(2);
    expect(iitbLogos.length).toBeGreaterThanOrEqual(2);

    techfestLogos.forEach((img) => expect(img.getAttribute('alt')).toBeTruthy());
    iitbLogos.forEach((img) => expect(img.getAttribute('alt')).toBeTruthy());
  });

  it('contains the 5 required technology domain buttons in Scene 04', () => {
    const domains = Array.from(document.querySelectorAll('.domain-pill-btn'));
    expect(domains.length).toBe(5);

    const keys = domains.map((d) => d.getAttribute('data-domain-key'));
    expect(keys).toContain('ai');
    expect(keys).toContain('robotics');
    expect(keys).toContain('aerospace');
    expect(keys).toContain('quantum');
    expect(keys).toContain('innovation');
  });

  it('contains the 4 required experience showcases in Scene 05', () => {
    const pillars = Array.from(document.querySelectorAll('.pillar-item'));
    expect(pillars.length).toBe(4);

    const titles = pillars.map((c) => c.querySelector('.pillar-title')?.textContent.trim());
    expect(titles).toContain('Competitions');
    expect(titles).toContain('Exhibitions');
    expect(titles).toContain('Workshops');
    expect(titles).toContain('Lectures & Experiences');
  });

  it('has verified official Techfest CTAs with target="_blank" and rel="noopener noreferrer"', () => {
    const ctaOfficial = document.getElementById('cta-official');
    expect(ctaOfficial).not.toBeNull();
    expect(ctaOfficial.getAttribute('href')).toBe('https://techfest.org/');
    expect(ctaOfficial.getAttribute('target')).toBe('_blank');
    expect(ctaOfficial.getAttribute('rel')).toContain('noopener');
    expect(ctaOfficial.getAttribute('rel')).toContain('noreferrer');

    const headerLink = document.getElementById('header-official-link');
    expect(headerLink).not.toBeNull();
    expect(headerLink.getAttribute('href')).toBe('https://techfest.org/');
  });

  it('strictly verifies removal of right-side chapter navigation and explorer popup', () => {
    expect(document.getElementById('chapter-hud')).toBeNull();
    expect(document.getElementById('hud-progress-fill')).toBeNull();
    expect(document.getElementById('explorer-overlay')).toBeNull();
  });

  it('enforces semantic landmarks for WCAG 2.2 AA', () => {
    expect(document.querySelector('header[role="banner"]')).not.toBeNull();
    expect(document.querySelector('main#main-content')).not.toBeNull();
    expect(document.querySelector('footer[role="contentinfo"]')).not.toBeNull();
    expect(document.querySelector('a.skip-to-main')).not.toBeNull();
  });
});
