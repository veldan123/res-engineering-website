---
name: RES Engineering Services
description: Singapore electrical engineering firm — engineering-document design system
colors:
  ink: "#0C1118"
  ink-2: "#414B5A"
  ink-3: "#5B6474"
  paper: "#FFFFFF"
  paper-2: "#F2F4F8"
  line: "#D9DEE7"
  line-strong: "#AEB7C6"
  brand: "#1D2FBF"
  brand-deep: "#131F86"
  brand-ink: "#0D1560"
  phase-r: "#E03C31"
  phase-y: "#F2B705"
  phase-b: "#2E5BFF"
  ok: "#0E8345"
typography:
  family: "Archivo (variable, wdth 62–125, wght 100–900)"
  display:
    fontSize: "clamp(2.4rem, 5.4vw, 4.3rem)"
    fontWeight: 800
    fontStretch: "114%"
    lineHeight: 1.02
    letterSpacing: "-0.018em"
  section-title:
    fontSize: "clamp(1.7rem, 3.4vw, 2.55rem)"
    fontWeight: 800
    fontStretch: "112%"
    lineHeight: 1.08
  body:
    fontSize: "0.9–1rem"
    fontWeight: 400
    lineHeight: 1.65–1.85
  spec-label:
    fontSize: "0.68–0.75rem"
    fontWeight: 700
    letterSpacing: "0.07–0.14em"
    transform: uppercase
rounded:
  radius: "3px"
  radius-lg: "4px"
easing: "cubic-bezier(0.16, 1, 0.3, 1)"
---

# Design System: "The Test Certificate"

The site is an engineering document. White/cool-gray paper, near-black ink, hairline rules, spec-sheet labels. Deep cobalt (#0D1560→#1D2FBF) is the Committed colour: it drenches the hero, CTA banner, and footer (~35% of the surface) and appears nowhere else at scale. Phase-yellow (#F2B705) is the single emphasis colour inside drenched panels.

## Named rules

**The Busbar Rule.** Three stacked 1px hairlines — red #E03C31, yellow #F2B705, blue #2E5BFF (Singapore 3-phase order R-Y-B, top to bottom) — implemented as `.site-header::after` and `.site-footer::before`. Exactly twice per page. Never used as a divider elsewhere.

**The Rating Plate.** Stats live in a nameplate: 2px ink border, 4px radius, four corner screws, uppercase engraved title row, hairline-divided cells. Expanded-width 800 numerals. This is the only place big numbers appear.

**The Ledger.** Services on the home page are full-width rows under a 1.5px ink top rule: name + spec line | description | boxed arrow. Hover shifts background to paper-2 and indents. Never convert back to icon-card grids.

**Document labels.** Uppercase tracked micro-labels are allowed ONLY inside genuine data contexts: form labels, spec cards, agenda times, plate titles, footer column heads. Never above section headings (no eyebrows — `.section-label` is display:none).

**Drenched inversion.** Inside `.hero` and `.cta-banner`, `.btn-primary` inverts to white fill / brand-ink text. Grid-paper texture (rgba-white 4.5% lines, 56px cells) appears only on drenched cobalt panels; ink-tinted grid paper (5%, 28–44px) on `.page-hero` and card thumbs.

## Components

- **Buttons**: 3px radius, weight 650. Primary = ink fill → brand on hover. Outline-dark = 1.5px ink border → filled ink on hover. Active state nudges down 1px.
- **Nav**: white, sticky, hairline bottom + busbar rule. Active link = 2px brand underline. `.btn-nav.active` keeps white text on brand fill.
- **Cards** (projects/blog/training): 1px line border → ink border + translateY(-3px) on hover. No shadows at rest. Thumbs are grid-paper panels with a brand-stroke SVG.
- **Callouts**: full 1.5px brand border + brand-tint background. Side-stripes banned.
- **Badges**: bordered chips with a leading phase-colour dot (ema=blue, safety=green, tech=yellow).
- **Forms**: 1.5px line-strong borders, uppercase labels, brand focus ring (3px glow).
- **Hero art**: inline SVG single-line diagram (supply → breaker → transformer → busbar → feeders), white strokes at 38%, R/Y/B node dots, CSS dash-draw on load (2.4s expo-out), static under reduced motion, hidden below 1024px.

## Motion

- System easing `cubic-bezier(0.16,1,0.3,1)` everywhere. No bounce.
- Reveal-on-scroll: opacity+22px rise, 80ms stagger within grids, gated behind `html.js` so no-JS renders everything visible.
- Page transitions: exit fade only (0.2s on internal link click). NO entrance body fade — blank-page risk for crawlers.
- `prefers-reduced-motion: reduce` collapses all animation and shows final states.

## Do / Don't

- **Do** keep the legacy alias variables in :root (`--accent`, `--text-light`, `--border`, …) — inner-page inline styles depend on them.
- **Do** use Archivo width axis for hierarchy (114% display → 106–112% headings → 100% body). Weight+width carry hierarchy, not colour.
- **Don't** add a second typeface, gradient text, shadows at rest, eyebrows, numbered section markers, or emoji.
- **Don't** use phase colours decoratively outside the busbar rule, badge dots, diagram nodes, and hero emphasis.
