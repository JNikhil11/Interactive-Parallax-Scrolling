import { clamp, lerp } from '../utils/math.js';
import { isReducedMotionPreferred } from '../utils/dom.js';

let canvas = null;
let ctx = null;
let animId = null;
let currentProgress = 0;
let sparks = [];

export function initEnergyMotif() {
  destroyEnergyMotif();

  canvas = document.getElementById('energy-trail-canvas');
  if (!canvas) return;
  ctx = canvas.getContext('2d');

  function resize() {
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Floating spark pool
  sparks = [];
  for (let i = 0; i < 40; i++) {
    sparks.push({
      x: 0,
      y: 0,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5 - 0.5,
      life: 0,
      maxLife: Math.random() * 40 + 20,
      size: Math.random() * 2.5 + 1,
      color: '#00E5FF',
    });
  }

  function getEnergyTrajectory(p) {
    const w = canvas.width;
    const h = canvas.height;

    // 6-scene path waypoints
    if (p < 0.18) {
      // Scene 1: Central hovering spark
      return {
        x: w * 0.5,
        y: h * 0.48 + Math.sin(performance.now() * 0.002) * (h * 0.02),
        radius: 14 + Math.sin(performance.now() * 0.004) * 3,
        color: '#00E5FF',
        glow: '#FFC107',
        alpha: 0.9,
      };
    } else if (p < 0.36) {
      // Scene 2: Arcs down to blueprint drawing point
      const localT = (p - 0.18) / 0.18;
      const startX = w * 0.5;
      const startY = h * 0.48;
      const targetX = w * (window.innerWidth < 800 ? 0.5 : 0.68);
      const targetY = h * 0.58;
      return {
        x: lerp(startX, targetX, localT),
        y: lerp(startY, targetY, localT),
        radius: 11,
        color: '#38BDF8',
        glow: '#E0F7FA',
        alpha: 0.85,
      };
    } else if (p < 0.56) {
      // Scene 3: Energy core connecting robotics
      const localT = (p - 0.36) / 0.20;
      const startX = w * (window.innerWidth < 800 ? 0.5 : 0.68);
      const startY = h * 0.58;
      const targetX = w * (window.innerWidth < 800 ? 0.5 : 0.5);
      const targetY = h * 0.55;
      return {
        x: lerp(startX, targetX, localT),
        y: lerp(startY, targetY, localT),
        radius: 12 + Math.sin(performance.now() * 0.006) * 4,
        color: '#FB923C',
        glow: '#38BDF8',
        alpha: 0.9,
      };
    } else if (p < 0.74) {
      // Scene 4: Orbiting satellite trail
      const localT = (p - 0.56) / 0.18;
      const orbitAngle = -Math.PI * 0.3 + localT * Math.PI * 0.8;
      return {
        x: w * 0.5 + Math.cos(orbitAngle) * (w * 0.38),
        y: h * 0.45 + Math.sin(orbitAngle) * (h * 0.22),
        radius: 10,
        color: '#FF5722',
        glow: '#38BDF8',
        alpha: 0.85,
      };
    } else if (p < 0.88) {
      // Scene 5: Sweeping stage light beam
      const localT = (p - 0.74) / 0.14;
      const sweepX = w * (0.35 + Math.sin(localT * Math.PI * 2) * 0.3);
      return {
        x: sweepX,
        y: h * 0.42,
        radius: 14,
        color: '#22D3EE',
        glow: '#FBBF24',
        alpha: 0.85,
      };
    } else {
      // Scene 6: Expanding sunrise light
      const localT = (p - 0.88) / 0.12;
      return {
        x: w * 0.5,
        y: lerp(h * 0.5, h * 0.42, localT),
        radius: lerp(16, 45, localT),
        color: '#FDBA74',
        glow: '#FEF08A',
        alpha: lerp(0.85, 1.0, localT),
      };
    }
  }

  function render() {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!isReducedMotionPreferred()) {
      const state = getEnergyTrajectory(currentProgress);

      // Draw glowing aura
      const grad = ctx.createRadialGradient(
        state.x, state.y, 0,
        state.x, state.y, state.radius * 3.5
      );
      grad.addColorStop(0, state.color);
      grad.addColorStop(0.35, state.glow);
      grad.addColorStop(1, 'transparent');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(state.x, state.y, state.radius * 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Core bright center
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(state.x, state.y, state.radius * 0.5, 0, Math.PI * 2);
      ctx.fill();

      // Emit and render trailing sparks
      for (let s of sparks) {
        if (s.life <= 0) {
          s.x = state.x;
          s.y = state.y;
          s.life = s.maxLife;
          s.color = Math.random() > 0.5 ? state.color : state.glow;
        } else {
          s.life--;
          s.x += s.vx;
          s.y += s.vy;
          const alpha = (s.life / s.maxLife) * 0.6;
          ctx.fillStyle = s.color;
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1.0;
    }

    animId = requestAnimationFrame(render);
  }

  render();
}

export function updateEnergyMotifProgress(progress) {
  currentProgress = clamp(progress, 0, 1);
}

export function destroyEnergyMotif() {
  if (animId) {
    cancelAnimationFrame(animId);
    animId = null;
  }
}
