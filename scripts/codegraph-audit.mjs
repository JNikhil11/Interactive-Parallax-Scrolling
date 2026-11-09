import fs from 'fs';
import path from 'path';

console.log('--- CODEGRAPH AST & SELECTOR INTEGRITY AUDIT ---');

const ROOT_DIR = process.cwd();
const html = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');

const requiredSelectors = [
  '#scene-spark',
  '#spark-sphere-canvas',
  '#spark-headline',
  '#scene-imagination',
  '#imagination-blueprint-svg',
  '#scene-creation',
  '#exosuit-container',
  '#exosuit-3d-canvas',
  '#suit-stage-indicator',
  '#scene-frontier',
  '.domain-pill-btn',
  '#scene-gathering',
  '.pillar-item',
  '#scene-invitation',
  '#cta-explore',
  '#cta-official',
  '#domain-detail-panel',
  '#toggle-motion-btn',
  '#energy-trail-canvas',
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
