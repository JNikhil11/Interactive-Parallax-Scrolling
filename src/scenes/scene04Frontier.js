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
      scrub: 0.8,
    },
  });

  timeline
    .to('.earth-horizon', { rotation: 8, yPercent: -10, ease: 'none' }, 0)
    .to('.satellite-layer', {
      xPercent: 120,
      yPercent: -40,
      rotation: 15,
      ease: 'none',
    }, 0)
    .fromTo(
      '.domain-node',
      { y: 40, opacity: 0.4 },
      { y: 0, opacity: 1, stagger: 0.06, ease: 'power1.out' },
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
