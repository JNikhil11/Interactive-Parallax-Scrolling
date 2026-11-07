import { $ } from '../utils/dom.js';

let onMotionChangeCallback = null;

export function initAccessibility(onMotionChange) {
  onMotionChangeCallback = onMotionChange;
  const toggleBtn = $('#toggle-motion-btn');

  let isReduced = false;
  try {
    const storedPreference = localStorage.getItem('techfest-reduced-motion');
    if (storedPreference !== null) {
      isReduced = storedPreference === 'true';
    } else if (typeof window !== 'undefined' && window.matchMedia) {
      const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
      isReduced = Boolean(mql && mql.matches);
    }
  } catch (e) {
    isReduced = false;
  }

  applyMotionPreference(isReduced);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-reduced-motion') === 'true';
      const next = !current;
      try {
        localStorage.setItem('techfest-reduced-motion', String(next));
      } catch (e) {}
      applyMotionPreference(next);
      if (onMotionChangeCallback) {
        onMotionChangeCallback(next);
      }
    });
  }

  if (typeof window !== 'undefined' && window.matchMedia) {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mql && typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', (e) => {
        try {
          if (localStorage.getItem('techfest-reduced-motion') === null) {
            applyMotionPreference(e.matches);
            if (onMotionChangeCallback) {
              onMotionChangeCallback(e.matches);
            }
          }
        } catch (err) {}
      });
    }
  }
}

export function applyMotionPreference(isReduced) {
  const root = document.documentElement;
  const toggleBtn = $('#toggle-motion-btn');
  root.setAttribute('data-reduced-motion', String(Boolean(isReduced)));

  if (toggleBtn) {
    toggleBtn.setAttribute('aria-pressed', String(Boolean(isReduced)));
    toggleBtn.classList.toggle('active', Boolean(isReduced));
    const span = toggleBtn.querySelector('span');
    if (span) {
      span.textContent = isReduced ? 'Motion: Reduced' : 'Motion: Full';
    }
  }
}
