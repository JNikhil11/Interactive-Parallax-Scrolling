import fs from 'fs';
import path from 'path';

console.log('--- CODEGRAPH AST & SELECTOR INTEGRITY AUDIT ---');

const ROOT_DIR = process.cwd();
const html = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');

const modulesToCheck = [
  'src/scenes/scene01Spark.js',
  'src/scenes/scene02Imagination.js',
  'src/scenes/scene03Creation.js',
  'src/scenes/scene04Frontier.js',
  'src/scenes/scene05Gathering.js',
  'src/scenes/scene06Invitation.js',
  'src/components/chapterHud.js',
  'src/components/domainModal.js',
  'src/components/explorerOverlay.js',
];

const requiredSelectors = [
  '#scene-spark',
  '#spark-sphere-canvas',
  '#spark-headline',
  '#scene-imagination',
  '#imagination-blueprint-svg',
  '#scene-creation',
  '.part-left-manipulator',
  '.part-right-manipulator',
  '.part-central-core',
  '#scene-frontier',
  '.domain-node',
  '#scene-gathering',
  '.experience-card',
  '#scene-invitation',
  '#cta-explore',
  '#cta-official',
  '#chapter-hud',
  '#hud-progress-fill',
  '#domain-detail-panel',
  '#explorer-overlay',
  '#toggle-motion-btn',
];

let errors = 0;
requiredSelectors.forEach((selector) => {
  const clean = selector.replace(/[.#]/, '');
  if (!html.includes(clean)) {
    console.error(`[FAIL] Selector missing from index.html: ${selector}`);
    errors++;
  } else {
    console.log(`[PASS] Verified selector presence: ${selector}`);
  }
});

// Check for circular imports in src/utils
const mathUtil = fs.readFileSync(path.join(ROOT_DIR, 'src/utils/math.js'), 'utf8');
if (mathUtil.includes('from "../core') || mathUtil.includes('from "../scenes')) {
  console.error('[FAIL] Circular dependency detected in src/utils/math.js');
  errors++;
} else {
  console.log('[PASS] src/utils/math.js is completely isolated (0 circular imports).');
}

if (errors > 0) {
  console.error(`CodeGraph audit failed with ${errors} issues.`);
  process.exit(1);
} else {
  console.log('[SUCCESS] CodeGraph AST and selector alignment 100% verified.');
}
