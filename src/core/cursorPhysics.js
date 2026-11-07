import gsap from 'gsap';
import { isReducedMotionPreferred } from '../utils/dom.js';

let mouseMoveHandler = null;

export function initCursorPhysics() {
  destroyCursorPhysics();

  if (isReducedMotionPreferred() || !window.matchMedia('(pointer: fine)').matches) {
    return;
  }

  const depthElements = document.querySelectorAll('[data-mouse-depth]');
  const cards = document.querySelectorAll('.experience-card');

  mouseMoveHandler = (e) => {
    const normX = (e.clientX / window.innerWidth) * 2 - 1;
    const normY = (e.clientY / window.innerHeight) * 2 - 1;

    depthElements.forEach((el) => {
      const depth = parseFloat(el.getAttribute('data-mouse-depth') || '15');
      gsap.to(el, {
        x: normX * depth,
        y: normY * depth,
        rotateX: -normY * (depth * 0.25),
        rotateY: normX * (depth * 0.25),
        duration: 0.6,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    });

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
      }
    });
  };

  window.addEventListener('mousemove', mouseMoveHandler, { passive: true });
}

export function destroyCursorPhysics() {
  if (mouseMoveHandler) {
    window.removeEventListener('mousemove', mouseMoveHandler);
    mouseMoveHandler = null;
  }
}
