# Product Requirements Document (PRD)

## Project Title: TECHFEST — A FUTURE IN MOTION
**Subtitle:** Interactive Parallax Storytelling Experience  
**Context:** Independent Creative Concept for Techfest, IIT Bombay  
**Target URL:** `https://techfest.org/` (Official Link)  
**Dates:** 16th - 18th December, 2026

---

## 1. Executive Summary & Narrative Vision
Every technological revolution begins with a single spark of curiosity. That spark evolves into a structured idea, an engineered prototype, frontier scientific exploration, a global gathering of innovators, and ultimately a movement that transforms the future.

Inspired by the atmospheric spatial depth, dynamic pacing, and scroll-linked choreography of *The Boat* (SBS Australia), combined with high-performance editorial typography, the experience guides users across six seamless vertical chapters without harsh page cuts.

---

## 2. Functional Requirements (FR)
- **FR-01 (Multi-Layer Parallax):** Every scene contains 4 to 6 depth layers (`layer-far-bg`, `layer-mid-bg`, `layer-subject`, `layer-fg-particles`) moving at distinct relative velocities.
- **FR-02 (Continuous Story Flow):** Seamless vertical journey with real-time RGB interpolation across scene boundaries without hard edges.
- **FR-03 (Scene 01: The Spark):** Deep navy `#0A1128`, interactive high-DPI canvas energy sphere, 180 orbital particles, concentric rotating quantum containment rings, and hero typography reveal.
- **FR-04 (Scene 02: The Imagination):** Pinned scroll sequence in rich indigo `#1A237E`, perspective grid, mathematical equations, and translucent ice-blue `#E0F7FA` holographic SVG blueprint drawing on scroll scrub.
- **FR-05 (Scene 03: The Creation):** Pinned spatial robotics laboratory (`#0F172A`), multi-part articulated robotic assembly that docks into place strictly via scroll progress, plus 3 interactive inspection hotspots.
- **FR-06 (Scene 04: The Frontier):** Outer-space orbital Earth horizon (`#311B92` to `#FF5722`), curved rotating Earth limb, satellite array, and 5 interactive technology domains (AI, Robotics, Aerospace, Quantum Technology, Innovation & Engineering) with accessible HUD drawer.
- **FR-07 (Scene 05: The Gathering):** High-energy festival arena (`#1E0B36`), 5 dynamic volumetric spotlights sweeping across the stage, and 4 interactive experience showcases (Competitions, Exhibitions, Workshops, Lectures & Experiences) with 3D pointer glare.
- **FR-08 (Scene 06: The Invitation):** Sunrise finale (`#FF5722` to `#FFD166`), expanding solar corona simulating camera dolly into light, and verified CTAs (`EXPLORE TECHFEST` and `VISIT OFFICIAL WEBSITE` pointing to `https://techfest.org/`).
- **FR-09 (Chapter HUD & Navigation):** Fixed right-edge chapter progress indicator (`01` through `06`) with continuous scaleY fill line and smooth-scroll navigation.
- **FR-10 (Micro-Interactions):** Subtle 3D tilt (`rotateX`, `rotateY`, `translate3d`) responsive to pointer and touch.

---

## 3. Non-Functional Requirements (NFR)
- **NFR-01 (Responsiveness):** 320px to 3840px (4K), fluid `clamp()` scales, `100dvh` units, zero horizontal overflow.
- **NFR-02 (Performance):** 60fps scrolling, LCP <= 1.8s, CLS <= 0.02, INP <= 100ms.
- **NFR-03 (Accessibility):** WCAG 2.2 AA compliant, manual and media-query `prefers-reduced-motion` toggle, semantic landmarks, skip link.
- **NFR-04 (Brand Accuracy):** Sourced authentic Techfest copy and direct verified links to `https://techfest.org/`.
