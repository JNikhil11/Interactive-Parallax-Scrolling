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
      end: '+=150%',
      pin: true,
      scrub: 1,
      anticipatePin: 1,
    },
  });

  // Subtle grid reveal
  timeline.fromTo(
    '.blueprint-canvas-layer',
    { opacity: 0.1 },
    { opacity: 0.7, ease: 'none', duration: 0.25 },
    0
  );

  // Progressive drawing of blueprint strokes
  timeline.to(
    paths,
    {
      strokeDashoffset: 0,
      stagger: 0.02,
      ease: 'none',
      duration: 0.55,
    },
    0.15
  );

  // Gentle drift of the blueprint stage
  timeline.to(
    '.blueprint-stage',
    {
      y: -25,
      scale: 1.04,
      ease: 'power1.out',
      duration: 0.3,
    },
    0.7
  );
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
