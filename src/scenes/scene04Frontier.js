import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isReducedMotionPreferred } from '../utils/dom.js';

gsap.registerPlugin(ScrollTrigger);

let timeline = null;

export function initScene04() {
  destroyScene04();

  const scene = document.getElementById('scene-frontier');
  if (!scene) return;

  if (isReducedMotionPreferred()) {
    return;
  }

  timeline = gsap.timeline({
    scrollTrigger: {
      trigger: '#scene-frontier',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true, // Immediate direct scroll synchronization
    },
  });

  timeline
    .to('.earth-horizon-stage', { rotation: 6, yPercent: -8, ease: 'none' }, 0)
    .to(
      '.satellite-layer',
      {
        xPercent: 100,
        yPercent: -35,
        rotation: 12,
        ease: 'none',
      },
      0
    )
    .fromTo(
      '.domain-pill-btn',
      { y: 25, opacity: 0.6 },
      { y: 0, opacity: 1, stagger: 0.04, ease: 'power1.out' },
      0.15
    );
}

export function destroyScene04() {
  if (timeline) {
    if (timeline.scrollTrigger) timeline.scrollTrigger.kill();
    timeline.kill();
    timeline = null;
  }
}
