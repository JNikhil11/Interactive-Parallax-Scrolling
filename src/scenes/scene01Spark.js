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
  window.addEventListener('resize', resizeCanvas, { passive: true });

  // 180 depth-sorted orbital particles
  particles = [];
  const particleCount = window.innerWidth < 768 ? 65 : 180;
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      angle: Math.random() * Math.PI * 2,
      radius: Math.random() * 110 + 25,
      speed: (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
      size: Math.random() * 2.5 + 0.8,
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

      // Core plasma glow
      const pulse = 1 + Math.sin(time * 3) * 0.06;
      const coreGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, 90 * pulse);
      coreGrad.addColorStop(0, '#FFFFFF');
      coreGrad.addColorStop(0.25, '#FFC107');
      coreGrad.addColorStop(0.65, '#00E5FF');
      coreGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 100 * pulse, 0, Math.PI * 2);
      ctx.fill();

      // Orbital particles
      for (let p of particles) {
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

  // Offscreen canvas gating
  observer = new IntersectionObserver(([entry]) => {
    isVisible = entry.isIntersecting;
  }, { threshold: 0.05 });
  observer.observe(document.getElementById('scene-spark'));

  if (isReducedMotionPreferred()) {
    return;
  }

  // Scroll scrub choreography
  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: '#scene-spark',
      start: 'top top',
      end: 'bottom top',
      scrub: 0.8,
    },
  });

  timeline
    .to('.ring-outer', { rotation: 120, scale: 1.65, ease: 'none' }, 0)
    .to('.ring-mid', { rotation: -90, scale: 1.45, ease: 'none' }, 0)
    .to('.ring-inner', { rotation: 180, scale: 1.25, ease: 'none' }, 0)
    .to('.spark-sphere-container', { scale: 2.6, ease: 'power1.inOut' }, 0)
    .to('#spark-headline', { yPercent: -85, letterSpacing: '0.08em', opacity: 0, ease: 'power2.in' }, 0)
    .to('.scroll-prompt', { opacity: 0, y: -20, ease: 'power1.in' }, 0);

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
}
