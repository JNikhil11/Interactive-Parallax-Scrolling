import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isReducedMotionPreferred, $$ } from '../utils/dom.js';

gsap.registerPlugin(ScrollTrigger);

let timeline = null;

export function initScene02() {
  destroyScene02();

  const scene = document.getElementById('scene-imagination');
  const svg = document.getElementById('imagination-blueprint-svg');
  if (!scene || !svg) return;

  const paths = $$(
    '#imagination-blueprint-svg path, #imagination-blueprint-svg circle, #imagination-blueprint-svg line, #imagination-blueprint-svg rect'
  );

  paths.forEach((el) => {
    let len = 250;
    try {
      if (typeof el.getTotalLength === 'function') {
        len = Math.ceil(el.getTotalLength());
      }
    } catch (e) {
      len = 250;
    }
    el.style.strokeDasharray = `${len} ${len}`;
    if (!isReducedMotionPreferred()) {
      el.style.strokeDashoffset = `${len}`;
    } else {
      el.style.strokeDashoffset = '0';
    }
  });

  if (isReducedMotionPreferred()) {
    scene.classList.remove('is-pinned');
    return;
  }

  scene.classList.add('is-pinned');

  timeline = gsap.timeline({
    scrollTrigger: {
      trigger: '#scene-imagination',
      start: 'top top',
      end: '+=130%',
      pin: true,
      scrub: true, // Immediate direct scroll synchronization
      anticipatePin: 1,
    },
  });

  // Grid reveal
  timeline.fromTo(
    '.blueprint-canvas-layer',
    { opacity: 0.1 },
    { opacity: 0.7, ease: 'none', duration: 0.2 },
    0
  );

  // Progressive SVG line drafting
  paths.forEach((pathEl, idx) => {
    timeline.to(
      pathEl,
      {
        strokeDashoffset: 0,
        duration: 0.35,
        ease: 'none',
      },
      idx * 0.04
    );
  });
}

export function destroyScene02() {
  if (timeline) {
    if (timeline.scrollTrigger) timeline.scrollTrigger.kill();
    timeline.kill();
    timeline = null;
  }
  const scene = document.getElementById('scene-imagination');
  if (scene) scene.classList.remove('is-pinned');
}
