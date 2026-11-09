import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isReducedMotionPreferred } from '../utils/dom.js';

gsap.registerPlugin(ScrollTrigger);

let parallaxTriggers = [];

const SPEED_MAP = {
  'layer-0': -0.15,
  'layer-1': -0.25,
  'layer-2': 0.20,
  'layer-3': 0.45,
  'layer-4': 0.85,
};

/**
 * Optimized Scene-Level Parallax Engine
 * Eliminates multiple competing scrub loops by using direct 1:1 synchronization (scrub: true).
 */
export function initParallaxEngine() {
  destroyParallaxEngine();

  if (isReducedMotionPreferred()) {
    return;
  }

  const scenes = document.querySelectorAll('.scene');
  scenes.forEach((scene) => {
    const layers = Array.from(scene.querySelectorAll('[data-parallax-layer]')).map((layer) => {
      const layerType = layer.getAttribute('data-parallax-layer');
      const customSpeed = layer.getAttribute('data-parallax-speed');
      const speed = customSpeed ? parseFloat(customSpeed) : (SPEED_MAP[layerType] || 0.25);
      return { el: layer, speed };
    });

    if (layers.length === 0) return;

    const trigger = ScrollTrigger.create({
      trigger: scene,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true, // Direct 1:1 synchronization without trailing delay
      onUpdate: (self) => {
        const scrollDistance = (self.progress - 0.5) * 350;
        const count = layers.length;
        for (let i = 0; i < count; i++) {
          const item = layers[i];
          const yOffset = (-scrollDistance * item.speed).toFixed(1);
          item.el.style.transform = `translate3d(0, ${yOffset}px, 0)`;
        }
      },
    });

    parallaxTriggers.push(trigger);
  });
}

export function destroyParallaxEngine() {
  parallaxTriggers.forEach((trigger) => trigger.kill());
  parallaxTriggers = [];
  document.querySelectorAll('[data-parallax-layer]').forEach((el) => {
    el.style.transform = '';
  });
}
