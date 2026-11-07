import { interpolateColor, clamp } from '../utils/math.js';

const SCENE_PALETTES = [
  {
    bgPrimary: '#0A1128',
    bgSecondary: '#111D4A',
    accentPrimary: '#00E5FF',
    accentSecondary: '#FFC107',
  },
  {
    bgPrimary: '#1A237E',
    bgSecondary: '#0D47A1',
    accentPrimary: '#E0F7FA',
    accentSecondary: '#00E5FF',
  },
  {
    bgPrimary: '#0F172A',
    bgSecondary: '#1E293B',
    accentPrimary: '#00B4D8',
    accentSecondary: '#FF6B35',
  },
  {
    bgPrimary: '#311B92',
    bgSecondary: '#4A148C',
    accentPrimary: '#FF5722',
    accentSecondary: '#00E5FF',
  },
  {
    bgPrimary: '#1E0B36',
    bgSecondary: '#3B0764',
    accentPrimary: '#00E5FF',
    accentSecondary: '#FFB703',
  },
  {
    bgPrimary: '#FF5722',
    bgSecondary: '#FFD166',
    accentPrimary: '#FFDDD2',
    accentSecondary: '#0A1128',
  },
];

let canvas = null;
let ctx = null;
let animationFrameId = null;
let particles = [];
let isRendering = true;

export function initAtmosphere() {
  canvas = document.getElementById('atmosphere-canvas');
  if (!canvas) return;
  ctx = canvas.getContext('2d');

  function resize() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
  }

  function initParticles() {
    particles = [];
    const count = window.innerWidth < 768 ? 40 : 90;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.6 + 0.4,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        alpha: Math.random() * 0.6 + 0.2,
      });
    }
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();

  function render() {
    if (!ctx || !canvas) return;
    if (isRendering) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#FFFFFF';
      for (let p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;
    }
    animationFrameId = requestAnimationFrame(render);
  }

  render();
}

export function updateAtmosphere(globalProgress) {
  const p = clamp(globalProgress, 0, 1);
  const totalTransitions = SCENE_PALETTES.length - 1;
  const scaled = p * totalTransitions;
  const index = Math.min(Math.floor(scaled), totalTransitions - 1);
  const localT = scaled - index;

  const current = SCENE_PALETTES[index];
  const next = SCENE_PALETTES[index + 1] || current;

  const bgPrimary = interpolateColor(current.bgPrimary, next.bgPrimary, localT);
  const bgSecondary = interpolateColor(current.bgSecondary, next.bgSecondary, localT);
  const accentPrimary = interpolateColor(current.accentPrimary, next.accentPrimary, localT);
  const accentSecondary = interpolateColor(current.accentSecondary, next.accentSecondary, localT);

  const root = document.documentElement;
  root.style.setProperty('--bg-current-primary', bgPrimary);
  root.style.setProperty('--bg-current-secondary', bgSecondary);
  root.style.setProperty('--accent-current-primary', accentPrimary);
  root.style.setProperty('--accent-current-secondary', accentSecondary);
}

export function setAtmosphereRendering(active) {
  isRendering = Boolean(active);
}

export function destroyAtmosphere() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}
