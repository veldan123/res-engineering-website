# Product

## Register

brand

## Users

Facility managers, procurement officers, and building owners in Singapore searching for licensed electrical services (LEW, testing, EMA licences, shutdown servicing, safety training). They arrive from Google, need to verify credibility and compliance fast, and contact via form or phone. Decision-makers 30s–50s, desktop and mobile.

## Product Purpose

resengrg.com is the client-acquisition site for RES Engineering Services Pte. Ltd., a Singapore electrical engineering firm (registered 2014). It exists to rank for electrical-services searches in Singapore and convert visitors into enquiries. SEO is critical: the site replaced a Sitelio build and must preserve its URL structure and rankings.

Contact: +65 9684 2296 · nicholas@sg-res.com · 1 Mactaggart Road, #03-01 Invest Ho Building, Singapore 368089. Form via Formspree.

## Brand Personality

"The Test Certificate." RES's product is trust with electricity — stamped test reports, EMA licences, switchgear nameplates. The site reads like a precise engineering document: authoritative, certified, safety-critical. Not a startup, not a template.

## Design North Star

- **The busbar rule**: three stacked hairlines in Singapore's three-phase colours (red/yellow/blue) under the nav and above the footer. The signature device — electricians recognise it instantly. Used exactly twice per page, never as general decoration.
- **Rating plate**: company stats presented as an equipment nameplate (2px ink border, corner screws, engraved labels), not a SaaS hero-metric block.
- **Schedule ledger**: services listed as full-width document rows, not icon-card grids.
- **Schematic imagery**: SVG single-line diagrams (real engineering notation) instead of stock photos or gradient decoration.

## Anti-references

- AI-corporate template tells: eyebrow labels above every section, gradient hero orbs, identical icon+heading+text card grids, hero stat blocks, side-stripe card accents, cream backgrounds. All banned.
- Generic "electrical" clichés: lightning-bolt-everything, black-and-safety-yellow hazard styling.
- No emojis anywhere. SVG icons only (stroke-based, 1.75–2 weight).

## Constraints

- Pure HTML5/CSS3/vanilla JS. No frameworks, no build step. Hosted on Vercel.
- All 9 original URLs preserved exactly. Canonicals, sitemap.xml, Schema.org JSON-LD maintained.
- Legacy CSS variable names (--accent, --text-light, --border, …) are aliased in :root because inner pages use them in inline styles. Do not remove the aliases.
- No JS-gated entrance fade on body: fast crawlers/preview renderers capture blank pages. Exit fade on navigation clicks only.

## Accessibility

WCAG AA. `prefers-reduced-motion` alternatives for all animation. Reveal-on-scroll only applies under `html.js` so content is visible without JS.
