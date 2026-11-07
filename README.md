# TECHFEST — A FUTURE IN MOTION

> **An Interactive Parallax Storytelling Experience**  
> *Independent Creative Web Engineering Concept for Techfest, IIT Bombay*  
> **Official Festival Dates:** 16th – 18th December, 2026 | **Official Website:** [https://techfest.org/](https://techfest.org/)

[![Vite Build](https://img.shields.io/badge/Vite-6.x%20Production%20Ready-646CFF.svg)](https://vitejs.dev/)
[![GSAP Motion](https://img.shields.io/badge/GSAP-3.12%20ScrollTrigger-88CE02.svg)](https://gsap.com/)
[![Lenis Scroll](https://img.shields.io/badge/Lenis-Smooth%20Scroll-black.svg)](https://lenis.darkroom.engineering/)
[![Unit Tests](https://img.shields.io/badge/Vitest-17%2F17%20Passed-success.svg)](#testing-and-verification)
[![A11y](https://img.shields.io/badge/WCAG-2.2%20AA%20Compliant-brightgreen.svg)](#accessibility)
[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](LICENSE)

---

## 1. Project Overview & Architectural Vision

**TECHFEST — A FUTURE IN MOTION** is a vertical interactive parallax web journey chronicling the arc of human curiosity and technological revolution. Developed as an independent creative concept for the **College Ambassador (CA) program of Techfest, IIT Bombay** (Asia's Largest Science and Technology Festival), the experience combines cinematic scroll-driven storytelling with strict performance budgets and WCAG 2.2 AA accessibility.

### Narrative North Star
Inspired by the spatial immersion and scroll pacing of *The Boat* (SBS Australia), the site connects six vertical story chapters into a continuous chromatic and mechanical journey without jarring section seams:
- **01 // THE SPARK:** Point-source golden-cyan fusion core suspended in cosmic space illuminating the question that starts every revolution.
- **02 // THE IMAGINATION:** Pinned perspective blueprint drawing itself via scroll-scrubbed vector stroke offsets and theoretical telemetry equations.
- **03 // THE CREATION:** Pinned robotics laboratory with multi-part articulated industrial manipulators docking into place strictly controlled by scroll progress.
- **04 // THE FRONTIER:** Orbiting satellite crossing an outer-space Earth horizon with 5 interactive technology domain nodes (AI, Robotics, Aerospace, Quantum, Innovation).
- **05 // THE GATHERING:** Festival arena illuminated by sweeping volumetric stage spotlights and 4 interactive showcase pillars with 3D pointer tilt.
- **06 // THE INVITATION:** Expansive sunrise horizon with forward camera dolly bloom and verified primary conversion CTAs.

---

## 2. Technical Stack & Rationale

| Layer | Technology | Specification / Role |
|---|---|---|
| **Core Architecture** | Vanilla ES2024 + Vite 6 | Zero virtual-DOM overhead, sub-pixel DOM updates at 60–120fps |
| **Animation Choreography** | GSAP 3.12+ (ScrollTrigger) | Pinned scrubbing, exploded mechanical docking, timeline coordination |
| **Scroll Normalization** | Lenis | Smooth momentum scrolling synchronized with `gsap.ticker` |
| **Atmospheric Rendering** | HTML5 Canvas + WebGL Shaders | GPU-accelerated ambient plasma core and particle fields |
| **Testing Suite** | Vitest + Playwright + JSDOM | 17 unit tests, multi-viewport E2E visual parallax assertions |
| **Harness & DevSecOps** | `affaan-m/ECC` Standard | Context anchoring, CodeGraph AST audit, and 100-point gate runner |

---

## 3. Brand Identity & Official Assets

The project prominently features both official branding marks provided for the assignment:
- **Techfest Official Logo** (`assets/techfest-logo.png`): Displayed in the primary header and footer.
- **IIT Bombay Official Seal** (`assets/iitb-logo.png`): Featured in brand lockup and institutional accreditation.
- **Direct Official Linking:** All external conversion touchpoints point verified visitors to the official Techfest website at [https://techfest.org/](https://techfest.org/).

---

## 4. Quick Start & Development Commands

```bash
# Clone the repository
git clone https://github.com/JNikhil11/Interactive-Parallax-Scrolling.git
cd Interactive-Parallax-Scrolling

# Install locked dependencies
npm install

# Start local development server (http://localhost:5173)
npm run dev

# Run unit and integration tests (Vitest)
npm run test

# Run asset and link verification
npm run verify:assets

# Run CodeGraph AST module boundary audit
npm run audit:codegraph

# Execute 100-point autonomous QA audit
npm run self:audit

# Build optimized production bundle
npm run build
```

---

## 5. Accessibility & Reduced Motion

- **Full Keyboard Navigation:** All domain nodes, machine hotspots, chapter navigation buttons, and overlays are navigable via `Tab`, `Enter`, `Space`, and `Escape`.
- **Reduced Motion Support:** Visitors can toggle motion comfort mode at any time using the `#toggle-motion-btn` switch in the header, or via their operating system's `prefers-reduced-motion: reduce` preference. When active, all scroll-jacking and pinning sequences are safely collapsed into accessible static flow while preserving 100% of interactive content.

---

## 6. Attribution & Disclaimer

*TECHFEST — A FUTURE IN MOTION* is an independent creative concept created for Techfest, IIT Bombay. This project is not an official redesign or commercial endorsement. All official inquiries, festival registration, and programming details are available exclusively at [https://techfest.org/](https://techfest.org/).
