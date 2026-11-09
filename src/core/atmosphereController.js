import { interpolateColor, clamp } from '../utils/math.js';

const SCENE_PALETTES = [
  {
    bgPrimary: '#070D1F',
    bgSecondary: '#0E172E',
    accentPrimary: '#00E5FF',
    accentSecondary: '#FFC107',
  },
  {
    bgPrimary: '#07172B',
    bgSecondary: '#0B2545',
    accentPrimary: '#38BDF8',
    accentSecondary: '#818CF8',
  },
  {
    bgPrimary: '#0E111A',
    bgSecondary: '#1A1822',
    accentPrimary: '#940B18',
    accentSecondary: '#D8B24A',
  },
  {
    bgPrimary: '#0B0F28',
    bgSecondary: '#191A42',
    accentPrimary: '#FF5722',
    accentSecondary: '#00E5FF',
  },
  {
    bgPrimary: '#1A1208',
    bgSecondary: '#29180C',
    accentPrimary: '#00E5FF',
    accentSecondary: '#FBBF24',
  },
  {
    bgPrimary: '#1D120A',
    bgSecondary: '#2E190E',
    accentPrimary: '#FDBA74',
    accentSecondary: '#FEF08A',
  },
];

let canvas = null;
let ctx = null;
let animationFrameId = null;
let particles = [];
let isRendering = true;
let currentProgress = 0;
let targetProgress = 0;
let currentGradColor1 = SCENE_PALETTES[0].bgPrimary;
let currentGradColor2 = SCENE_PALETTES[0].bgSecondary;

export function initAtmosphere() {
  destroyAtmosphere();

  canvas = document.getElementById('atmosphere-canvas');
  if (!canvas) return;
  ctx = canvas.getContext('2d');

  function resize() {
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    initParticles();
  }

  function initParticles() {
    particles = [];
    const count = window.innerWidth < 768 ? 35 : 75;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.4,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        alpha: Math.random() * 0.5 + 0.2,
      });
    }
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();

  function render() {
    if (!ctx || !canvas) return;

    if (isRendering) {
      const w = canvas.width;
      const h = canvas.height;

      // Smooth progress interpolation
      currentProgress += (targetProgress - currentProgress) * 0.2;

      // Calculate interpolated scene gradient
      const p = clamp(currentProgress, 0, 1);
      const totalTransitions = SCENE_PALETTES.length - 1;
      const scaled = p * totalTransitions;
      const index = Math.min(Math.floor(scaled), totalTransitions - 1);
      const localT = scaled - index;

      const current = SCENE_PALETTES[index];
      const next = SCENE_PALETTES[index + 1] || current;

      currentGradColor1 = interpolateColor(current.bgPrimary, next.bgPrimary, localT);
      currentGradColor2 = interpolateColor(current.bgSecondary, next.bgSecondary, localT);

      // Render smooth atmospheric background gradient directly on canvas (zero DOM reflows)
      const grad = ctx.createRadialGradient(w * 0.5, h * 0.45, 10, w * 0.5, h * 0.5, w * 0.85);
      grad.addColorStop(0, currentGradColor2);
      grad.addColorStop(1, currentGradColor1);

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Ambient celestial dust particles
      ctx.fillStyle = '#FFFFFF';
      for (let p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

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

/**
 * Direct progress update without DOM style invalidations
 */
export function updateAtmosphere(globalProgress) {
  targetProgress = clamp(globalProgress, 0, 1);
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
