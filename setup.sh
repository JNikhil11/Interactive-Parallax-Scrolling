#!/usr/bin/env bash
set -euo pipefail

echo "===================================================="
echo " TECHFEST — A FUTURE IN MOTION | Setup Bootstrap"
echo "===================================================="

command -v node >/dev/null 2>&1 || { echo "Node.js is required but not installed. Aborting." >&2; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "npm is required but not installed. Aborting." >&2; exit 1; }

echo "Installing npm dependencies..."
npm install

echo "Verifying local assets..."
node scripts/verify-assets.mjs

echo "Verifying CodeGraph AST..."
node scripts/codegraph-audit.mjs

echo "Running Vitest unit suite..."
npm run test:unit

echo "Building production assets..."
npm run build

echo "Setup complete. Run 'npm run dev' to start the development server."
