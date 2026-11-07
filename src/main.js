import { initSmoothScroll, destroySmoothScroll } from './core/lenisSetup.js';
import { initAtmosphere, destroyAtmosphere } from './core/atmosphereController.js';
import { initEnergyMotif, destroyEnergyMotif } from './core/energyMotif.js';
import { initParallaxEngine, destroyParallaxEngine } from './core/parallaxEngine.js';
import { initCursorPhysics, destroyCursorPhysics } from './core/cursorPhysics.js';
import { initAccessibility } from './core/accessibility.js';
import { initJourneyTracker, destroyJourneyTracker } from './components/journeyTracker.js';
import { initDomainModal } from './components/domainModal.js';

import { initScene01, destroyScene01 } from './scenes/scene01Spark.js';
import { initScene02, destroyScene02 } from './scenes/scene02Imagination.js';
import { initScene03, destroyScene03 } from './scenes/scene03Creation.js';
import { initScene04, destroyScene04 } from './scenes/scene04Frontier.js';
import { initScene05, destroyScene05 } from './scenes/scene05Gathering.js';
import { initScene06, destroyScene06 } from './scenes/scene06Invitation.js';
import { getLenis } from './core/lenisSetup.js';

function bootExperience(isReducedMotion = false) {
  // Tear down existing state
  destroyParallaxEngine();
  destroyScene01();
  destroyScene02();
  destroyScene03();
  destroyScene04();
  destroyScene05();
  destroyScene06();
  destroyJourneyTracker();
  destroyCursorPhysics();
  destroyEnergyMotif();

  // Initialize Smooth Scroll
  initSmoothScroll(isReducedMotion);

  // Initialize Scenes
  initScene01();
  initScene02();
  initScene03();
  initScene04();
  initScene05();
  initScene06();

  // Initialize Parallax & Physics
  initParallaxEngine();
  initCursorPhysics();

  // Initialize Journey Tracker & Recurring Energy Motif
  initJourneyTracker();
  initEnergyMotif();
}

document.addEventListener('DOMContentLoaded', () => {
  // Atmosphere Canvas
  initAtmosphere();

  // Interactive Domain Modal
  initDomainModal();

  // Explore button smooth scroll
  const ctaExplore = document.getElementById('cta-explore');
  if (ctaExplore) {
    ctaExplore.addEventListener('click', () => {
      const target = document.getElementById('scene-spark');
      if (target) {
        const lenis = getLenis();
        if (lenis) {
          lenis.scrollTo(target, { duration: 1.5 });
        } else {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }

  // Accessibility & Motion Toggle
  initAccessibility((isReduced) => {
    bootExperience(isReduced);
  });

  // Initial Boot
  const isReducedInitial = document.documentElement.getAttribute('data-reduced-motion') === 'true';
  bootExperience(isReducedInitial);
});
