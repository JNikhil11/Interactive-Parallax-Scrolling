import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isReducedMotionPreferred, $$ } from '../utils/dom.js';

gsap.registerPlugin(ScrollTrigger);

let timeline = null;

export function initScene05() {
  destroyScene05();

  const scene = document.getElementById('scene-gathering');
  if (!scene) return;

  if (isReducedMotionPreferred()) {
    return;
  }

  const beams = $$('.spotlight-beam');
  const cards = $$('.experience-card');

  timeline = gsap.timeline({
    scrollTrigger: {
      trigger: '#scene-gathering',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.7,
    },
  });

  // Dynamic sweeping spotlights
  if (beams.length >= 4) {
    timeline
      .to(beams[0], { rotation: 25, ease: 'none' }, 0)
      .to(beams[1], { rotation: -20, ease: 'none' }, 0)
      .to(beams[2], { rotation: 22, ease: 'none' }, 0)
      .to(beams[3], { rotation: -18, ease: 'none' }, 0);
  }

  // Staggered parallax card reveal
  if (cards.length >= 4) {
    // Left column cards
    timeline.fromTo(
      [cards[0], cards[2]],
      { y: 60, opacity: 0.6 },
      { y: -20, opacity: 1, ease: 'none' },
      0.1
    );
    // Right column cards with distinct velocity
    timeline.fromTo(
      [cards[1], cards[3]],
      { y: 110, opacity: 0.4 },
      { y: -45, opacity: 1, ease: 'none' },
      0.15
    );
  }
}

export function destroyScene05() {
  if (timeline) {
    if (timeline.scrollTrigger) timeline.scrollTrigger.kill();
    timeline.kill();
    timeline = null;
  }
}
