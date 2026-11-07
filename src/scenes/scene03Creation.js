import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isReducedMotionPreferred, $$, $ } from '../utils/dom.js';

gsap.registerPlugin(ScrollTrigger);

let timeline = null;

export function initScene03() {
  destroyScene03();

  const scene = document.getElementById('scene-creation');
  if (!scene) return;

  const leftArm = $('.part-left-manipulator');
  const rightArm = $('.part-right-manipulator');
  const centralCore = $('.part-central-core');
  const sensorHead = $('.part-upper-sensor-head');
  const chassisBase = $('.part-lower-chassis-base');
  const hudOverlay = $('.part-circuit-hud-overlay');

  // Hotspots setup
  const hotspots = $$('.hotspot-trigger');
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

  if (isReducedMotionPreferred()) {
    scene.classList.remove('is-pinned');
    if (leftArm) gsap.set(leftArm, { x: 0, y: 0, rotation: 0, opacity: 1 });
    if (rightArm) gsap.set(rightArm, { x: 0, y: 0, rotation: 0, opacity: 1 });
    if (centralCore) gsap.set(centralCore, { scale: 1, opacity: 1 });
    if (sensorHead) gsap.set(sensorHead, { y: 0, opacity: 1 });
    if (chassisBase) gsap.set(chassisBase, { y: 0, opacity: 1 });
    if (hudOverlay) gsap.set(hudOverlay, { scale: 1, opacity: 1 });
    return;
  }

  scene.classList.add('is-pinned');

  // Set initial exploded assembly state
  if (leftArm) gsap.set(leftArm, { x: -220, y: -90, rotation: -35, opacity: 0.6 });
  if (rightArm) gsap.set(rightArm, { x: 220, y: -90, rotation: 35, opacity: 0.6 });
  if (centralCore) gsap.set(centralCore, { scale: 0.4, opacity: 0 });
  if (sensorHead) gsap.set(sensorHead, { y: -180, opacity: 0.5 });
  if (chassisBase) gsap.set(chassisBase, { y: 190, opacity: 0.5 });
  if (hudOverlay) gsap.set(hudOverlay, { scale: 0.7, opacity: 0 });

  timeline = gsap.timeline({
    scrollTrigger: {
      trigger: '#scene-creation',
      start: 'top top',
      end: '+=180%',
      pin: true,
      scrub: 0.9,
      anticipatePin: 1,
    },
  });

  // Phase 1 (0% -> 30%): Core ignites and base docks
  timeline
    .to(centralCore, { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' }, 0)
    .to(chassisBase, { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }, 0.05);

  // Phase 2 (30% -> 70%): Manipulators and sensor head converge
  timeline
    .to(leftArm, { x: 0, y: 0, rotation: 0, opacity: 1, duration: 0.4, ease: 'power1.inOut' }, 0.25)
    .to(rightArm, { x: 0, y: 0, rotation: 0, opacity: 1, duration: 0.4, ease: 'power1.inOut' }, 0.25)
    .to(sensorHead, { y: 0, opacity: 1, duration: 0.35, ease: 'power1.inOut' }, 0.3);

  // Phase 3 (70% -> 100%): HUD overlays activate, telemetry glows
  timeline
    .to(hudOverlay, { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' }, 0.7)
    .fromTo(hotspots, { opacity: 0, y: 15 }, { opacity: 1, y: 0, stagger: 0.08, duration: 0.3, ease: 'power2.out' }, 0.75);
}

export function destroyScene03() {
  if (timeline) {
    if (timeline.scrollTrigger) timeline.scrollTrigger.kill();
    timeline.kill();
    timeline = null;
  }
  const scene = document.getElementById('scene-creation');
  if (scene) scene.classList.remove('is-pinned');
}
