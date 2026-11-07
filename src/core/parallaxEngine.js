import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isReducedMotionPreferred } from '../utils/dom.js';

gsap.registerPlugin(ScrollTrigger);

let parallaxTriggers = [];

const SPEED_MAP = {
  'layer-0': -0.15,
  'layer-1': -0.30,
  'layer-2': 0.25,
  'layer-3': 0.55,
  'layer-4': 1.15,
};

export function initParallaxEngine() {
  destroyParallaxEngine();

  if (isReducedMotionPreferred()) {
    return;
  }

  const scenes = document.querySelectorAll('.scene');
  scenes.forEach((scene) => {
    const layers = scene.querySelectorAll('[data-parallax-layer]');
    layers.forEach((layer) => {
      const layerType = layer.getAttribute('data-parallax-layer');
      const customSpeed = layer.getAttribute('data-parallax-speed');
      const speed = customSpeed ? parseFloat(customSpeed) : (SPEED_MAP[layerType] || 0.3);

      const trigger = ScrollTrigger.create({
        trigger: scene,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.6,
        onUpdate: (self) => {
          const scrollDistance = self.progress * 400 - 200;
          const yOffset = -scrollDistance * speed;
          gsap.set(layer, {
            y: yOffset,
            force3D: true,
          });
        },
      });

      parallaxTriggers.push(trigger);
    });
  });
}

export function destroyParallaxEngine() {
  parallaxTriggers.forEach((trigger) => trigger.kill());
  parallaxTriggers = [];
  document.querySelectorAll('[data-parallax-layer]').forEach((el) => {
    gsap.set(el, { clearProps: 'y' });
  });
}
