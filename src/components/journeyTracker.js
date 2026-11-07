import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { updateAtmosphere } from '../core/atmosphereController.js';
import { updateEnergyMotifProgress } from '../core/energyMotif.js';

gsap.registerPlugin(ScrollTrigger);

let globalScrollTrigger = null;

export function initJourneyTracker() {
  destroyJourneyTracker();

  globalScrollTrigger = ScrollTrigger.create({
    trigger: document.body,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      const p = self.progress;
      updateAtmosphere(p);
      updateEnergyMotifProgress(p);
    },
  });
}

export function destroyJourneyTracker() {
  if (globalScrollTrigger) {
    globalScrollTrigger.kill();
    globalScrollTrigger = null;
  }
}
