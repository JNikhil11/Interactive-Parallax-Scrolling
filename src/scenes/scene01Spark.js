import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isReducedMotionPreferred } from '../utils/dom.js';

gsap.registerPlugin(ScrollTrigger);

let canvas = null;
let ctx = null;
let animationId = null;
let particles = [];
let sceneTrigger = null;
let observer = null;
let isVisible = true;
let resizeHandler = null;

export function initScene01() {
  destroyScene01();

  canvas = document.getElementById('spark-sphere-canvas');
  if (!canvas) return;
  ctx = canvas.getContext('2d');

  function resizeCanvas() {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = (rect.width || 360) * dpr;
    canvas.height = (rect.height || 360) * dpr;
  }

  resizeCanvas();
  resizeHandler = resizeCanvas;
  window.addEventListener('resize', resizeHandler, { passive: true });

  particles = [];
  const particleCount = window.innerWidth < 768 ? 40 : 100;
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      angle: Math.random() * Math.PI * 2,
      radius: Math.random() * 105 + 20,
      speed: (Math.random() * 0.015 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
      size: Math.random() * 2.0 + 0.8,
      color: Math.random() > 0.4 ? '#00E5FF' : '#FFC107',
      alpha: Math.random() * 0.7 + 0.3,
    });
  }

  function renderSphere() {
    if (!ctx || !canvas) return;
    if (isVisible) {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const time = performance.now() * 0.001;

      ctx.clearRect(0, 0, w, h);

      // Core plasma aura
      const pulse = 1 + Math.sin(time * 2.5) * 0.05;
      const coreGrad = ctx.createRadialGradient(cx, cy, 4, cx, cy, 80 * pulse);
      coreGrad.addColorStop(0, '#FFFFFF');
      coreGrad.addColorStop(0.2, '#FFC107');
      coreGrad.addColorStop(0.6, '#00E5FF');
      coreGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 85 * pulse, 0, Math.PI * 2);
      ctx.fill();

      // Orbital sparks
      const pCount = particles.length;
      for (let i = 0; i < pCount; i++) {
        const p = particles[i];
        p.angle += p.speed;
        const px = cx + Math.cos(p.angle) * p.radius;
        const py = cy + Math.sin(p.angle) * (p.radius * 0.45);

        ctx.globalAlpha = p.alpha * (0.6 + Math.sin(time * 2 + p.angle) * 0.4);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;
    }

    animationId = requestAnimationFrame(renderSphere);
  }

  renderSphere();

  // Canvas visibility gating (saves 100% GPU when user is in other scenes)
  const section = document.getElementById('scene-spark');
  if (section) {
    observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.02 }
    );
    observer.observe(section);
  }

  if (isReducedMotionPreferred()) {
    return;
  }

  // Camera moves toward energy source with direct scroll sync (zero trailing lag)
  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: '#scene-spark',
      start: 'top top',
      end: 'bottom top',
      scrub: true, // Immediate direct synchronization
    },
  });

  timeline
    .to('.ring-outer', { rotation: 90, scale: 1.5, ease: 'none' }, 0)
    .to('.ring-mid', { rotation: -70, scale: 1.35, ease: 'none' }, 0)
    .to('.spark-illustration-stage', { scale: 2.0, yPercent: 12, ease: 'none' }, 0)
    .to('#spark-headline', { yPercent: -35, opacity: 0, ease: 'none' }, 0)
    .to('.editorial-subtext', { yPercent: -25, opacity: 0, ease: 'none' }, 0)
    .to('.scroll-hint', { opacity: 0, ease: 'none' }, 0);

  sceneTrigger = timeline.scrollTrigger;
}

export function destroyScene01() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  if (sceneTrigger) {
    sceneTrigger.kill();
    sceneTrigger = null;
  }
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler);
    resizeHandler = null;
  }
}
