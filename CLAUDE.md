# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static multi-page website for **Projekt M Immobilien GmbH** (Munich real estate company), live at `https://projektmimmobilien.de`. Built with Astro + TypeScript + Plain CSS. No frontend framework.

## Commands

```bash
npm run dev          # Start Astro dev server (network-accessible via host: true)
npm run build        # Astro check + Astro build → dist/
npm run typecheck    # Astro check (TypeScript + Astro diagnostics)
npm run preview      # Preview production build locally
npm run deploy       # Build + FTP upload via deploy.sh (requires .env with FTP creds)
```

No linter, formatter, or test framework is configured. `astro check` (TypeScript strict mode) is the primary code quality gate.

## Architecture

### Astro Multi-Page Setup

Pages live in `src/pages/` and Astro generates clean URLs with `trailingSlash: 'always'` and `build.format: 'directory'`.

Pages: `src/pages/index.astro` (homepage), `src/pages/datenschutz.astro`, `src/pages/impressum.astro`, `src/pages/404.astro`.

### Layouts

- `src/layouts/BaseLayout.astro` — Full HTML document with `<head>` (meta, OG, JSON-LD, fonts), accepts props for SEO metadata
- `src/layouts/LegalLayout.astro` — Extends BaseLayout with `data-page="legal"`, Navigation + Footer for legal pages

### Components

Astro components in `src/components/`:
- `Hero.astro` — Hero section with gradient, logo, DIN seal
- `Navigation.astro` — Sticky nav + hamburger + scroll-spy (includes navigation.ts script)
- `TopKontakt.astro` — Contact bar with phone/email
- `Footer.astro` — Footer with nav links, address, contact
- `SealsPopover.astro` — Popover dialog for seal details (includes seals-popover.ts script)
- `VacationBanner.astro` — Date-based vacation banner (reads `src/data/banners.json`)
- `XmasBanner.astro` — Date-based Christmas banner (reads `src/data/banners.json`)
- `Icon.astro` — Inline SVG icon component (replaces Font Awesome), uses `fill="currentColor"`. Neue Icons hinzufügen: SVG von [fontawesome.com/icons](https://fontawesome.com/icons) suchen, `viewBox` und `d`-Pfad in die `ICONS`-Map in `Icon.astro` eintragen, dann `<Icon name="neuer-name" />` verwenden. TypeScript prüft gültige Namen beim Build.

### Seasonal Banners

Banners are **date-based automated** via `src/data/banners.json`. The Astro frontmatter checks `new Date()` at build time and only renders HTML when active — no manual toggling needed.

### CSS

Global styles in `src/styles/global.css` (~970 lines, plain CSS). Uses CSS custom properties for theming (`--c-primary`, `--c-secondary`, `--c-accent`, etc.). No preprocessor. Responsive breakpoints at 900px, 768px, and 640px.

Component-specific styles live in scoped `<style>` blocks within their respective `.astro` files (TopKontakt, Navigation, Hero, XmasBanner, VacationBanner, Footer, SealsPopover, 404). Global.css retains only shared styles: variables, resets, typography, flip-cards, homepage sections, scroll animations, highlights, legal styles, and utilities.

### Client-Side JavaScript

Split into focused modules in `src/scripts/`:
- `scroll-animations.ts` — IntersectionObserver for `.fade-in`, `.slide-in-*`, `.scale-up` + `data-stagger` containers
- `flip-cards.ts` — 3D CSS flip interaction for `.kacheln .flip_container`
- `navigation.ts` — Mobile hamburger, scroll-spy active state via IntersectionObserver
- `seals-popover.ts` — Native HTML Popover API with `SEALS` registry from `src/data/seals.json`

Scripts are included via `<script>` tags in their respective components. Astro auto-deduplicates.

### Static Assets & Image Pipeline

**Rasterbilder** (JPG, PNG, JPEG) gehören nach `src/assets/img/` — Astro optimiert sie beim Build:
- `<Image>` erzeugt eine optimierte WebP-Version
- `<Picture formats={['avif', 'webp']}>` erzeugt AVIF + WebP + Fallback (für große Bilder verwenden)
- Astro skaliert Bilder auf die per `width`/`height`-Prop angegebene Größe herunter
- Ohne `width`/`height` wird die volle Originalauflösung verwendet — daher immer angeben!
- Astro erzeugt **kein** automatisches responsive `srcset` mit mehreren Größen

**Empfohlene `width`-Werte:**

| Verwendung | width (px) |
|---|---|
| Vollbild-Hintergründe (Hero, Banner) | 1600–2000 |
| Portraits, Karten, Content-Bilder | 500–800 |
| Siegel/Logos (PNG) | 300–500 |
| SVGs | Keine Optimierung nötig |

**Dateien in `public/`** werden 1:1 ausgeliefert (keine Optimierung):
- SVGs in `public/img/` (HypZert, Logo etc.)
- Favicons in `public/img/favicon/`
- Vendored Leaflet in `public/leaflet/`

Unbenutzte Bilder liegen in `src/assets/img/_unused/`.

**Sonstige Assets:**
- Open Sans variable font via `@fontsource-variable/open-sans`

### Deployment

FTP-based via `lftp` in `deploy.sh`. Hosted on Dogado shared hosting with Apache (`.htaccess` for 404 routing, HTTPS redirect, caching headers). No CI/CD pipeline — deployment is manual from a developer machine.

### Sitemap

Generated automatically by `@astrojs/sitemap` integration at `/sitemap-index.xml`.

## Key Conventions

- Content and code comments are in **German**; commit messages in **English**
- Accessibility: `aria-*` attributes, `.sr-only` class, `tabindex="0"` on interactive elements, `aria-current="page"` on nav links
- Third-party scripts (CCM19 cookie consent, ProvenExpert widget) are loaded inline with `is:inline` in Astro templates
- Leaflet map uses CCM19 loader pattern (`type="text/x-ccm-loader"`) for consent-gated loading
