# AGENTS.md — Sub-Agent Orchestration & Protocol

## Project: TECHFEST — A FUTURE IN MOTION
**Harness:** `affaan-m/ECC` (Everything Claude Code / Antigravity Harness)  
**Host Environment:** Google Antigravity IDE | Flash 3.8 High (Turbo Mode)  
**Target GitHub Profile:** `https://github.com/JNikhil11`  
**Target Repository:** `Interactive Parallax Scrolling`  
**Target Deployment:** Vercel (Production)

---

## 1. Multi-Agent Swarm Topology

```
                       +---------------------------------------+
                       |   ORCHESTRATOR AGENT (Main Thread)    |
                       |   Controls ECC Loop & Gate Sign-Off   |
                       +-------------------+-------------------+
                                           |
        +------------------+---------------+---------------+------------------+
        |                  |                               |                  |
        v                  v                               v                  v
+---------------+  +---------------+               +---------------+  +---------------+
| Sub-Agent 01  |  | Sub-Agent 02  |               | Sub-Agent 03  |  | Sub-Agent 04  |
|  ARCH & DOM   |  | VISUAL & SVG  |               | GSAP & SHADER |  |  QA, SECOPS   |
|   ARCHITECT   |  |  ART DIRECTOR |               | CHOREOGRAPHER |  |  & DEVOPS     |
+---------------+  +---------------+               +---------------+  +---------------+
```

---

## 2. Agent Contracts & Responsibilities

### Sub-Agent 01: `Arch-DOM-Agent`
- **Focus:** Semantic HTML5 landmarks, fluid typography CSS tokens, responsive layout (320px - 3840px), skip links, and DOM accessibility.
- **Verification Deliverable:** `.ecc/reports/01-arch-dom-report.json`.

### Sub-Agent 02: `Art-Director-Asset-Agent`
- **Focus:** Forensic asset audit, official Techfest & IIT Bombay logos, procedural multi-group SVGs (energy rings, blueprints, robotic assembly, satellites, stage cones), and zero broken links.
- **Verification Deliverable:** `.ecc/reports/02-asset-manifest.json`.

### Sub-Agent 03: `Choreography-Physics-Agent`
- **Focus:** Unified Lenis + GSAP ScrollTrigger ticker, 6-scene scroll timelines, pinned scrubbing (Scene 2 & 3), continuous chromatic morphing, canvas particle systems, and 3D pointer physics.
- **Verification Deliverable:** `.ecc/reports/03-choreography-metrics.json`.

### Sub-Agent 04: `Verification-SecOps-Release-Agent`
- **Focus:** Vitest unit tests, Playwright E2E parallax assertions, Semgrep security compliance, CSP configuration in `vercel.json`, GitHub repository publishing, and live Vercel deployment.
- **Verification Deliverable:** `.ecc/reports/04-final-verification-dossier.md`.

---

## 3. Mandatory Development Cycle (ECC Loop)
$$\text{Plan} \rightarrow \text{Test (Red)} \rightarrow \text{Implement (Green)} \rightarrow \text{Review} \rightarrow \text{Verify} \rightarrow \text{Remember} \rightarrow \text{Improve}$$
