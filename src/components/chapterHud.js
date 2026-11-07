import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getLenis } from '../core/lenisSetup.js';
import { updateAtmosphere } from '../core/atmosphereController.js';
import { $, $$ } from '../utils/dom.js';

gsap.registerPlugin(ScrollTrigger);

let globalTrigger = null;
let sceneTriggers = [];

const CHAPTER_TITLES = {
  '01': '01 // THE SPARK',
  '02': '02 // THE IMAGINATION',
  '03': '03 // THE CREATION',
  '04': '04 // THE FRONTIER',
  '05': '05 // THE GATHERING',
  '06': '06 // THE INVITATION',
};

export function initChapterHud() {
  destroyChapterHud();

  const progressFill = $('#hud-progress-fill');
  const percentageEl = $('#hud-percentage');
  const chapterReadout = $('#header-chapter-readout');
  const navBtns = $$('.chapter-nav-btn');

  // Global document scroll tracker
  globalTrigger = ScrollTrigger.create({
    trigger: document.body,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      const p = self.progress;
      if (progressFill) {
        progressFill.style.transform = `scaleY(${p})`;
      }
      if (percentageEl) {
        percentageEl.textContent = `${Math.round(p * 100)}%`;
      }
      updateAtmosphere(p);
    },
  });

  // Track active chapter per scene
  const scenes = $$('.scene');
  scenes.forEach((scene) => {
    const chapterId = scene.getAttribute('data-chapter');
    const trigger = ScrollTrigger.create({
      trigger: scene,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => setActiveChapter(chapterId),
      onEnterBack: () => setActiveChapter(chapterId),
    });
    sceneTriggers.push(trigger);
  });

  // Click & keyboard handlers
  navBtns.forEach((btn) => {
    const targetSceneSelector = btn.getAttribute('data-scene-target');
    btn.addEventListener('click', () => {
      scrollToScene(targetSceneSelector);
    });
  });

  function setActiveChapter(id) {
    if (!id) return;
    navBtns.forEach((btn) => {
      const btnId = btn.getAttribute('data-scene');
      const isActive = btnId === id;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-current', isActive ? 'step' : 'false');
    });

    if (chapterReadout && CHAPTER_TITLES[id]) {
      chapterReadout.textContent = CHAPTER_TITLES[id];
    }
  }

  function scrollToScene(selector) {
    const target = $(selector);
    if (!target) return;
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(target, { duration: 1.4, offset: 0 });
    } else {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }

  setActiveChapter('01');
}

export function destroyChapterHud() {
  if (globalTrigger) {
    globalTrigger.kill();
    globalTrigger = null;
  }
  sceneTriggers.forEach((t) => t.kill());
  sceneTriggers = [];
}
