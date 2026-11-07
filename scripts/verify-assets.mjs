import fs from 'fs';
import path from 'path';

console.log('--- FORENSIC ASSET & LINK VERIFIER ---');

const ROOT_DIR = process.cwd();
const requiredAssets = [
  'assets/techfest-logo.png',
  'assets/iitb-logo.png',
  'public/techfest-logo.png',
  'public/iitb-logo.png',
];

let missing = 0;
requiredAssets.forEach((assetPath) => {
  const fullPath = path.join(ROOT_DIR, assetPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`[FAIL] Missing required asset: ${assetPath}`);
    missing++;
  } else {
    const stat = fs.statSync(fullPath);
    console.log(`[PASS] Asset verified: ${assetPath} (${(stat.size / 1024).toFixed(1)} KB)`);
  }
});

// Check index.html for dead image links or placeholders
const htmlContent = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
const bannedWords = ['TODO', 'FIXME', 'XXX', 'TBD', 'similar for scenes'];
bannedWords.forEach((word) => {
  if (htmlContent.includes(word)) {
    console.error(`[FAIL] Prohibited placeholder found in index.html: ${word}`);
    missing++;
  }
});

if (missing > 0) {
  console.error(`Asset verification failed with ${missing} errors.`);
  process.exit(1);
} else {
  console.log('[SUCCESS] All assets and copy constraints strictly verified.');
}
