import { initSmoothScroll, destroySmoothScroll } from './core/lenisSetup.js';
import { initAtmosphere, destroyAtmosphere } from './core/atmosphereController.js';
import { initParallaxEngine, destroyParallaxEngine } from './core/parallaxEngine.js';
import { initCursorPhysics, destroyCursorPhysics } from './core/cursorPhysics.js';
import { initAccessibility } from './core/accessibility.js';
import { initChapterHud, destroyChapterHud } from './components/chapterHud.js';
import { initDomainModal } from './components/domainModal.js';
import { initExplorerOverlay } from './components/explorerOverlay.js';

import { initScene01, destroyScene01 } from './scenes/scene01Spark.js';
import { initScene02, destroyScene02 } from './scenes/scene02Imagination.js';
import { initScene03, destroyScene03 } from './scenes/scene03Creation.js';
import { initScene04, destroyScene04 } from './scenes/scene04Frontier.js';
import { initScene05, destroyScene05 } from './scenes/scene05Gathering.js';
import { initScene06, destroyScene06 } from './scenes/scene06Invitation.js';

function bootExperience(isReducedMotion = false) {
  // Tear down any existing triggers
  destroyParallaxEngine();
  destroyScene01();
  destroyScene02();
  destroyScene03();
  destroyScene04();
  destroyScene05();
  destroyScene06();
  destroyChapterHud();
  destroyCursorPhysics();

  // Initialize Smooth Scroll
  initSmoothScroll(isReducedMotion);

  // Initialize Scenes
  initScene01();
  initScene02();
  initScene03();
  initScene04();
  initScene05();
  initScene06();

  // Initialize Global Parallax Engine & Micro-Interactions
  initParallaxEngine();
  initCursorPhysics();

  // Initialize Components
  initChapterHud();
}

document.addEventListener('DOMContentLoaded', () => {
  // Atmosphere Canvas
  initAtmosphere();

  // Dialog & Navigation Components
  initDomainModal();
  initExplorerOverlay();

  // Accessibility & Reduced Motion Controller
  initAccessibility((isReduced) => {
    bootExperience(isReduced);
  });

  // Initial Boot
  const isReducedInitial = document.documentElement.getAttribute('data-reduced-motion') === 'true';
  bootExperience(isReducedInitial);
});
