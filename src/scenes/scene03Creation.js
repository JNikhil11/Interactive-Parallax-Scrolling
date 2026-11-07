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

  // Initial exploded assembly state
  if (leftArm) gsap.set(leftArm, { x: -180, y: -70, rotation: -30, opacity: 0.5 });
  if (rightArm) gsap.set(rightArm, { x: 180, y: -70, rotation: 30, opacity: 0.5 });
  if (centralCore) gsap.set(centralCore, { scale: 0.5, opacity: 0 });
  if (sensorHead) gsap.set(sensorHead, { y: -140, opacity: 0.4 });
  if (chassisBase) gsap.set(chassisBase, { y: 150, opacity: 0.4 });
  if (hudOverlay) gsap.set(hudOverlay, { scale: 0.7, opacity: 0 });

  timeline = gsap.timeline({
    scrollTrigger: {
      trigger: '#scene-creation',
      start: 'top top',
      end: '+=160%',
      pin: true,
      scrub: 0.9,
      anticipatePin: 1,
    },
  });

  // Docking sequence
  timeline
    .to(centralCore, { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' }, 0)
    .to(chassisBase, { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }, 0.05)
    .to(leftArm, { x: 0, y: 0, rotation: 0, opacity: 1, duration: 0.4, ease: 'power1.inOut' }, 0.2)
    .to(rightArm, { x: 0, y: 0, rotation: 0, opacity: 1, duration: 0.4, ease: 'power1.inOut' }, 0.2)
    .to(sensorHead, { y: 0, opacity: 1, duration: 0.35, ease: 'power1.inOut' }, 0.3)
    .to(hudOverlay, { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' }, 0.65)
    .fromTo(hotspots, { opacity: 0, y: 10 }, { opacity: 1, y: 0, stagger: 0.06, duration: 0.25, ease: 'power2.out' }, 0.7);
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
