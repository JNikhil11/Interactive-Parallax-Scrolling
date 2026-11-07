import { $, $$, setAriaExpanded } from '../utils/dom.js';
import { getLenis } from '../core/lenisSetup.js';

export function initExplorerOverlay() {
  const overlay = $('#explorer-overlay');
  const openBtns = [$('#header-explore-btn'), $('#cta-explore')].filter(Boolean);
  const closeBtn = $('#close-explorer');
  const chapterItems = $$('.quick-chapter-item');

  if (!overlay) return;

  function openOverlay() {
    overlay.classList.add('is-active');
    overlay.setAttribute('aria-hidden', 'false');
    openBtns.forEach((b) => setAriaExpanded(b, true));
    closeBtn?.focus();
  }

  function closeOverlay() {
    overlay.classList.remove('is-active');
    overlay.setAttribute('aria-hidden', 'true');
    openBtns.forEach((b) => setAriaExpanded(b, false));
  }

  openBtns.forEach((btn) => btn.addEventListener('click', openOverlay));
  closeBtn?.addEventListener('click', closeOverlay);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeOverlay();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-active')) {
      closeOverlay();
    }
  });

  chapterItems.forEach((item) => {
    item.addEventListener('click', () => {
      const targetSelector = item.getAttribute('data-target-scene');
      closeOverlay();
      if (targetSelector) {
        const target = $(targetSelector);
        if (target) {
          const lenis = getLenis();
          if (lenis) {
            lenis.scrollTo(target, { duration: 1.2 });
          } else {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    });
  });
}
