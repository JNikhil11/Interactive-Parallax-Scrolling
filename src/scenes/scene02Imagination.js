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

  // Setup path lengths for progressive drawing
  paths.forEach((el) => {
    let len = 300;
    try {
      if (typeof el.getTotalLength === 'function') {
        len = Math.ceil(el.getTotalLength());
      }
    } catch (e) {
      len = 300;
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
      end: '+=160%',
      pin: true,
      scrub: 1,
      anticipatePin: 1,
    },
  });

  // Phase 1 (0% -> 30%): Perspective grid tilts, headline reveals
  timeline.fromTo(
    '.blueprint-grid-canvas',
    { rotateX: 0, opacity: 0.3 },
    { rotateX: 18, opacity: 0.8, ease: 'none', duration: 0.3 },
    0
  );

  // Phase 2 (30% -> 75%): SVG paths draw via strokeDashoffset scrub
  timeline.to(
    paths,
    {
      strokeDashoffset: 0,
      stagger: 0.02,
      ease: 'none',
      duration: 0.45,
    },
    0.3
  );

  // Phase 3 (75% -> 100%): Telemetry equations lock in and glow
  timeline.fromTo(
    '.equation-card',
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, stagger: 0.05, ease: 'power2.out', duration: 0.25 },
    0.75
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
