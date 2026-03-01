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

- `src/layouts/BaseLayout.astro` — Full HTML document with `<head>` (meta, OG, JSON-LD, fonts, FA), accepts props for SEO metadata
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

### Seasonal Banners

Banners are **date-based automated** via `src/data/banners.json`. The Astro frontmatter checks `new Date()` at build time and only renders HTML when active — no manual toggling needed.

### CSS

Global styles in `src/styles/global.css` (~1425 lines, plain CSS). Uses CSS custom properties for theming (`--c-primary`, `--c-secondary`, `--c-accent`, etc.). No preprocessor. Responsive breakpoints at 900px, 768px, and 640px.

Font Awesome overrides in `src/styles/font-awesome-overrides.css`.

### Client-Side JavaScript

Split into focused modules in `src/scripts/`:
- `scroll-animations.ts` — IntersectionObserver for `.fade-in`, `.slide-in-*`, `.scale-up` + `data-stagger` containers
- `flip-cards.ts` — 3D CSS flip interaction for `.kacheln .flip_container`
- `navigation.ts` — Mobile hamburger, scroll-spy active state via IntersectionObserver
- `seals-popover.ts` — Native HTML Popover API with `SEALS` registry from `src/data/seals.json`

Scripts are included via `<script>` tags in their respective components. Astro auto-deduplicates.

### Static Assets

- Images in `src/assets/img/` (for future Astro Image pipeline use) and `public/img/` (currently served as-is)
- Favicons in `public/img/favicon/` (fixed paths)
- Vendored Leaflet in `public/leaflet/`
- Font Awesome 7 bundled via npm import
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
