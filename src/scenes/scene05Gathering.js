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
  const pillars = $$('.pillar-item');

  timeline = gsap.timeline({
    scrollTrigger: {
      trigger: '#scene-gathering',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true, // Immediate direct scroll synchronization
    },
  });

  // Sweeping stage spotlights
  if (beams.length >= 4) {
    timeline
      .to(beams[0], { rotation: 22, ease: 'none' }, 0)
      .to(beams[1], { rotation: -16, ease: 'none' }, 0)
      .to(beams[2], { rotation: 18, ease: 'none' }, 0)
      .to(beams[3], { rotation: -14, ease: 'none' }, 0);
  }

  // Reveals for pillars
  if (pillars.length >= 4) {
    timeline.fromTo(
      pillars,
      { y: 35, opacity: 0.6 },
      { y: 0, opacity: 1, stagger: 0.05, ease: 'power1.out' },
      0.1
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
