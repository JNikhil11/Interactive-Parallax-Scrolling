import { initExosuit3D, destroyExosuit3D } from './exosuit3D.js';
import { $$ } from '../utils/dom.js';

export function initScene03() {
  destroyScene03();

  // Initialize Three.js 15-Stage Cinematic Exosuit Assembly
  initExosuit3D();

  // Hotspot interactive detail pills
  const hotspots = $$('.hotspot-pill');
  hotspots.forEach((spot) => {
    spot.addEventListener('click', () => {
      const isExpanded = spot.getAttribute('aria-expanded') === 'true';
      hotspots.forEach((s) => {
        s.setAttribute('aria-expanded', 'false');
        s.classList.remove('active');
      });
      spot.setAttribute('aria-expanded', String(!isExpanded));
      spot.classList.toggle('active', !isExpanded);
    });
  });
}

export function destroyScene03() {
  destroyExosuit3D();
}
