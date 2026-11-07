# Architecture Decision Records (ADRs)

## Project: TECHFEST — A FUTURE IN MOTION

### ADR-001: Vanilla ES2024 + Vite Over Heavy SPA Frameworks
- **Status:** Accepted
- **Context:** The application is a 6-scene continuous scroll-driven visual story where DOM nodes must be directly manipulated at 60–120fps by GSAP `ScrollTrigger` and Lenis smooth scrolling.
- **Decision:** Use semantic HTML5, modular ES2024 JavaScript, and Vite as the bundler.
- **Consequence:** Zero React virtual-DOM reconciliation overhead during high-frequency scroll ticks; zero hydration mismatch errors; production bundle gzipped under 150 KB.

### ADR-002: Single Unified Animation Engine (GSAP 3.12+ + ScrollTrigger + Lenis)
- **Status:** Accepted
- **Context:** Multiple competing scroll or RAF loops cause severe scroll jitter, frame drops, and desynchronization.
- **Decision:** Standardize exclusively on Lenis for smooth scroll normalization and GSAP with ScrollTrigger for all scroll-linked timelines, pinning, and scrubbing. Bind both to a single unified `gsap.ticker` loop.
- **Consequence:** Deterministic scrub reversibility (scrolling backward reverses every animation smoothly) and zero competing RAF loops.

### ADR-003: Selective Canvas/WebGL Augmentation Over Full-Page WebGL Lock-In
- **Status:** Accepted
- **Context:** Rendering all typography and UI inside a single WebGL `<canvas>` degrades screen readers, SEO, text selection, and mobile responsiveness.
- **Decision:** Keep all narrative headlines, subtexts, interactive domain nodes, event cards, and CTAs in semantic, accessible HTML5 DOM layers. Use dedicated, `IntersectionObserver`-gated HTML5 `<canvas>` layers strictly for atmospheric effects that benefit from GPU shaders/particles (Scene 1 Energy Sphere & Particle Corona, Scene 4 Starfield/Orbital Dust, Scene 5 Volumetric Spotlights, Scene 6 Sunrise Bloom).
- **Consequence:** 100% WCAG 2.2 accessibility and crisp sub-pixel typography alongside cinematic 3D depth.

### ADR-004: Dual Logo Identity & Official Techfest Linking
- **Status:** Accepted
- **Context:** Techfest is the annual science & technology festival of IIT Bombay. The project is an independent creative concept that must honor the official brand identity while maintaining clear independent attribution.
- **Decision:** Prominently feature the official Techfest logo (`techfest-logo.png`) alongside the IIT Bombay seal (`iitb-logo.png`) in the header and navigation, while providing verified outbound links to `https://techfest.org/` with `rel="noopener noreferrer"`.
- **Consequence:** Clear brand synergy, authentic representation, and zero hallucinated claims.
