import { isReducedMotionPreferred } from '../utils/dom.js';

let mouseMoveHandler = null;
let animId = null;
let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;
let depthElements = [];
let isMoving = false;
let idleTimer = null;

/**
 * Immediate, High-Frequency Cursor Parallax
 * Uses passive mouse tracking and a single RAF loop without layout thrashing.
 * Eliminates sluggish trailing and excessive easing.
 */
export function initCursorPhysics() {
  destroyCursorPhysics();

  if (isReducedMotionPreferred() || !window.matchMedia('(pointer: fine)').matches) {
    return;
  }

  depthElements = Array.from(document.querySelectorAll('[data-mouse-depth]')).map((el) => {
    return {
      el,
      depth: parseFloat(el.getAttribute('data-mouse-depth') || '12'),
    };
  });

  if (depthElements.length === 0) return;

  mouseMoveHandler = (e) => {
    targetX = (e.clientX / window.innerWidth) * 2 - 1;
    targetY = (e.clientY / window.innerHeight) * 2 - 1;

    if (!isMoving) {
      isMoving = true;
      startLoop();
    }

    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      isMoving = false;
    }, 150);
  };

  function startLoop() {
    if (animId) return;

    function tick() {
      // Fast, snappy responsive interpolation (zero sluggish trailing)
      const dx = targetX - currentX;
      const dy = targetY - currentY;
      currentX += dx * 0.35;
      currentY += dy * 0.35;

      const len = depthElements.length;
      for (let i = 0; i < len; i++) {
        const item = depthElements[i];
        const moveX = (currentX * item.depth).toFixed(2);
        const moveY = (currentY * item.depth).toFixed(2);
        const rotX = (-currentY * (item.depth * 0.2)).toFixed(2);
        const rotY = (currentX * (item.depth * 0.2)).toFixed(2);

        item.el.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      }

      if (isMoving || Math.abs(dx) > 0.002 || Math.abs(dy) > 0.002) {
        animId = requestAnimationFrame(tick);
      } else {
        animId = null;
      }
    }

    animId = requestAnimationFrame(tick);
  }

  window.addEventListener('mousemove', mouseMoveHandler, { passive: true });
}

export function destroyCursorPhysics() {
  if (mouseMoveHandler) {
    window.removeEventListener('mousemove', mouseMoveHandler);
    mouseMoveHandler = null;
  }
  if (animId) {
    cancelAnimationFrame(animId);
    animId = null;
  }
  clearTimeout(idleTimer);
  depthElements.forEach((item) => {
    item.el.style.transform = '';
  });
  depthElements = [];
  isMoving = false;
}
