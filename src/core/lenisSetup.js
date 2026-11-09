import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let scrollHandler = null;
let virtualLenis = null;

/**
 * High-Performance Direct Scroll Controller
 * Eliminates artificial wheel latency and numerical scrub lag,
 * ensuring immediate 1:1 hardware-accelerated scroll responsiveness.
 */
export function initSmoothScroll(prefersReducedMotion = false) {
  destroySmoothScroll();

  ScrollTrigger.defaults({ markers: false });

  // Direct 1:1 native scroll synchronization with zero input lag
  scrollHandler = () => {
    ScrollTrigger.update();
  };
  window.addEventListener('scroll', scrollHandler, { passive: true });

  virtualLenis = {
    scrollTo: (target) => {
      if (!target) return;
      let el = target;
      if (typeof target === 'string') {
        el = document.querySelector(target);
      }
      if (el && el.scrollIntoView) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: 'smooth' });
      }
    },
    raf: () => {},
    destroy: destroySmoothScroll,
  };

  return {
    lenis: virtualLenis,
    destroy: destroySmoothScroll,
  };
}

export function getLenis() {
  return virtualLenis;
}

export function destroySmoothScroll() {
  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler);
    scrollHandler = null;
  }
  virtualLenis = null;
}
