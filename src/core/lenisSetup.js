import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenisInstance = null;
let tickerFn = null;

export function initSmoothScroll(prefersReducedMotion = false) {
  if (prefersReducedMotion) {
    ScrollTrigger.defaults({ markers: false });
    return null;
  }

  if (lenisInstance) {
    destroySmoothScroll();
  }

  lenisInstance = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.8,
    infinite: false,
  });

  lenisInstance.on('scroll', ScrollTrigger.update);

  tickerFn = (time) => {
    lenisInstance.raf(time * 1000);
  };

  gsap.ticker.add(tickerFn);
  gsap.ticker.lagSmoothing(0);

  return {
    lenis: lenisInstance,
    destroy: destroySmoothScroll,
  };
}

export function getLenis() {
  return lenisInstance;
}

export function destroySmoothScroll() {
  if (tickerFn) {
    gsap.ticker.remove(tickerFn);
    tickerFn = null;
  }
  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }
}
