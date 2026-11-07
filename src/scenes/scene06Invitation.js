import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isReducedMotionPreferred } from '../utils/dom.js';

gsap.registerPlugin(ScrollTrigger);

let timeline = null;

export function initScene06() {
  destroyScene06();

  const scene = document.getElementById('scene-invitation');
  if (!scene) return;

  if (isReducedMotionPreferred()) {
    return;
  }

  timeline = gsap.timeline({
    scrollTrigger: {
      trigger: '#scene-invitation',
      start: 'top bottom',
      end: 'bottom bottom',
      scrub: 0.8,
    },
  });

  timeline
    .fromTo(
      '.invitation-sun-corona',
      { scale: 0.7, opacity: 0.2 },
      { scale: 1.6, opacity: 0.8, ease: 'power2.out' },
      0
    )
    .fromTo(
      '.editorial-story',
      { y: 40, opacity: 0.6 },
      { y: 0, opacity: 1, ease: 'power1.out' },
      0.15
    );
}

export function destroyScene06() {
  if (timeline) {
    if (timeline.scrollTrigger) timeline.scrollTrigger.kill();
    timeline.kill();
    timeline = null;
  }
}
