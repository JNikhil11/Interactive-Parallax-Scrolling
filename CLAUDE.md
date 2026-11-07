# CLAUDE.md — Architecture & Command Reference

## Project Commands
- **Dev Server:** `npm run dev` (Runs Vite on `http://localhost:5173`)
- **Production Build:** `npm run build` (Generates optimized assets in `dist/`)
- **Unit Tests:** `npm run test` or `npm run test:unit` (Runs Vitest suite in `tests/unit/`)
- **E2E Tests:** `npm run test:e2e` (Runs Playwright suite in `tests/e2e/`)
- **Asset Verification:** `npm run verify:assets` (Runs forensic check on images and SVGs)
- **CodeGraph AST Audit:** `npm run audit:codegraph` (Validates module boundaries and DOM selectors)
- **100-Point Self-Audit:** `npm run self:audit` (Executes full QA gate suite)

## Architecture Overview
```
Interactive-Parallax-Scrolling/
├── index.html                  # Semantic WCAG 2.2 AA HTML5 Story Document
├── src/
│   ├── main.js                 # App Entry Point & Swarm Lifecycle Coordinator
│   ├── core/
│   │   ├── accessibility.js    # Reduced motion & keyboard controller
│   │   ├── atmosphereController.js # Dynamic 6-scene RGB lerp engine
│   │   ├── cursorPhysics.js    # Mouse & touch 3D perspective tilt
│   │   ├── lenisSetup.js       # Lenis + GSAP ticker synchronization
│   │   └── parallaxEngine.js   # Multi-layer vertical velocity manager
│   ├── components/
│   │   ├── chapterHud.js       # Fixed 01-06 chapter progress & jumper
│   │   ├── domainModal.js      # Accessible drawer for 5 tech domains
│   │   └── explorerOverlay.js  # Quick-navigator modal for chapters & pillars
│   ├── scenes/
│   │   ├── scene01Spark.js     # Energy sphere canvas & hero reveals
│   │   ├── scene02Imagination.js # Pinned holographic SVG blueprint drawing
│   │   ├── scene03Creation.js  # Pinned robotics assembly & inspection hotspots
│   │   ├── scene04Frontier.js  # Outer space Earth horizon & 5 domain nodes
│   │   ├── scene05Gathering.js # Dynamic stage spotlights & 4 experience cards
│   │   └── scene06Invitation.js # Golden sunrise camera dolly & CTAs
│   ├── styles/
│   │   ├── tokens.css          # Design tokens & fluid clamp() typography
│   │   ├── base.css            # Base resets & accessibility focus rings
│   │   ├── layout.css          # 100dvh containers & responsive grid
│   │   └── scenes.css          # Scene-specific layering & glassmorphism
│   └── utils/
│       ├── math.js             # lerp, clamp, mapRange, interpolateColor
│       └── dom.js              # DOM querying & ARIA state helpers
```

## Anti-Generic Design Constraints
- Never render flat black `#000000` or `#111827` dark mode.
- Must execute continuous chromatic progression across all 6 scenes:
  1. `#0A1128` (Deep Navy)
  2. `#1A237E` (Rich Indigo)
  3. `#0F172A` (Forged Slate Indigo)
  4. `#311B92` (Deep Space Violet)
  5. `#1E0B36` (Midnight Festival Violet)
  6. `#FF5722` to `#FFD166` (Sunrise Orange to Golden Dawn)
- Never use placeholder comments or ellipses (`TODO`, `similar for scenes 3-6`).
