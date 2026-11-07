# Design System & Chromatic Architecture

## 1. The 6-Scene Atmospheric Color Progression
The design system forbids flat black `#000000` or `#111827` generic dark templates. Instead, the viewport transforms along a cinematic journey of light and colour:

| Scene | Chapter | Primary Background | Secondary Gradient | Accent Primary | Accent Secondary | Atmosphere |
|---|---|---|---|---|---|---|
| **01** | **THE SPARK** | `#0A1128` (Deep Navy) | `#111D4A` (Cosmic Abyss) | `#00E5FF` (Bioluminescent Cyan) | `#FFC107` (Glowing Amber) | Suspended fusion core illuminating deep cosmic dust |
| **02** | **THE IMAGINATION** | `#1A237E` (Rich Indigo) | `#0D47A1` (Blueprint Cobalt) | `#E0F7FA` (Translucent Ice Blue) | `#00E5FF` (Drafting Cyan) | Precision technical grids, drafting blueprint schematics |
| **03** | **THE CREATION** | `#0F172A` (Forged Slate) | `#1E293B` (Metallic Gunmetal) | `#00B4D8` (Electric Arc Blue) | `#FF6B35` (Molten Forge Orange) | Industrial high-bay robotics lab with welding sparks |
| **04** | **THE FRONTIER** | `#311B92` (Space Violet) | `#4A148C` (Nebula Stratosphere) | `#FF5722` (Sunrise Limb Orange) | `#00E5FF` (Orbital Telemetry Cyan) | High orbital view of Earth horizon and satellite constellation |
| **05** | **THE GATHERING** | `#1E0B36` (Festival Violet) | `#3B0764` (Electric Magenta) | `#00E5FF` (Laser Cyan) | `#FFB703` (Festival Amber Gold) | Dynamic volumetric stage spotlights and collective festival arena |
| **06** | **THE INVITATION** | `#FF5722` (Sunrise Orange) | `#FFD166` (Golden Dawn) | `#FFDDD2` (Warm Peach Glow) | `#0A1128` (High-Contrast Ink Text) | Empowering golden dawn breaking over the horizon |

## 2. Fluid Typography Tokens
```css
--font-display: 'Space Grotesk', system-ui, -apple-system, sans-serif;
--font-sans: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', monospace;

--text-xs: clamp(0.75rem, 0.70rem + 0.25vw, 0.875rem);
--text-sm: clamp(0.875rem, 0.82rem + 0.30vw, 1.05rem);
--text-base: clamp(1.05rem, 0.96rem + 0.45vw, 1.35rem);
--text-lg: clamp(1.25rem, 1.10rem + 0.75vw, 1.75rem);
--text-xl: clamp(1.60rem, 1.30rem + 1.50vw, 2.50rem);
--text-display-md: clamp(2.00rem, 1.50rem + 2.50vw, 3.75rem);
--text-display-lg: clamp(2.50rem, 1.75rem + 3.75vw, 5.25rem);
```

## 3. Depth Layer Multiplier Spectrum
- **Plane 0 (Deep Space / Horizon):** $\lambda_0 = -0.15$
- **Plane 1 (Environmental Backdrop):** $\lambda_1 = -0.30$
- **Plane 2 (Midground Architecture / Schematics):** $\lambda_2 = 0.25$
- **Plane 3 (Primary Narrative & Hero Subject):** $\lambda_3 = 0.55$
- **Plane 4 (Foreground Particles / HUD / Debris):** $\lambda_4 = 1.15$
