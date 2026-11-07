import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';
import { initDomainModal } from '../../src/components/domainModal.js';
import { initAccessibility } from '../../src/core/accessibility.js';

describe('Interactive Components & Accessibility State Transitions', () => {
  let dom;
  let document;
  let window;

  beforeEach(() => {
    const htmlPath = path.resolve(__dirname, '../../index.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    dom = new JSDOM(htmlContent, { url: 'http://localhost:5173' });
    document = dom.window.document;
    window = dom.window;

    global.document = document;
    global.window = window;
    global.localStorage = {
      store: {},
      getItem(key) {
        return this.store[key] || null;
      },
      setItem(key, val) {
        this.store[key] = String(val);
      },
    };
  });

  it('opens and closes the domain detail modal correctly', () => {
    initDomainModal();

    const aiButton = document.querySelector('.domain-node[data-domain-key="ai"]');
    const panel = document.getElementById('domain-detail-panel');
    const modalTitle = document.getElementById('domain-modal-title');
    const closeBtn = document.getElementById('close-domain-panel');

    expect(panel.classList.contains('is-active')).toBe(false);

    aiButton.click();

    expect(panel.classList.contains('is-active')).toBe(true);
    expect(aiButton.getAttribute('aria-expanded')).toBe('true');
    expect(modalTitle.textContent).toBe('Artificial Intelligence');

    closeBtn.click();

    expect(panel.classList.contains('is-active')).toBe(false);
    expect(aiButton.getAttribute('aria-expanded')).toBe('false');
  });

  it('toggles reduced motion state on button click', () => {
    initAccessibility(() => {});

    const toggleBtn = document.getElementById('toggle-motion-btn');
    const root = document.documentElement;

    expect(root.getAttribute('data-reduced-motion')).toBe('false');

    toggleBtn.click();
    expect(root.getAttribute('data-reduced-motion')).toBe('true');
    expect(toggleBtn.getAttribute('aria-pressed')).toBe('true');

    toggleBtn.click();
    expect(root.getAttribute('data-reduced-motion')).toBe('false');
    expect(toggleBtn.getAttribute('aria-pressed')).toBe('false');
  });
});
