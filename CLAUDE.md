# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static multi-page website for **Projekt M Immobilien GmbH** (Munich real estate company), live at `https://projektmimmobilien.de`. Built with Vite + Handlebars templating + TypeScript. No frontend framework — vanilla HTML/CSS/JS.

## Commands

```bash
npm run dev          # Start Vite dev server (network-accessible via host: true)
npm run build        # Typecheck (tsc --noEmit) + Vite build → dist/
npm run typecheck    # TypeScript check only
npm run preview      # Preview production build locally
npm run deploy       # Build + FTP upload via deploy.sh (requires .env with FTP creds)
```

No linter, formatter, or test framework is configured. TypeScript strict mode is the primary code quality gate.

## Architecture

### Multi-Page Setup

Each page is a standalone `index.html` in its own directory (clean URLs). Vite auto-discovers all `**/index.html` files via `fast-glob` in `vite.config.ts` and builds them as separate Rollup entry points.

Pages: `/index.html` (homepage), `/datenschutz/index.html`, `/impressum/index.html`, `/404/index.html`.

### Handlebars Templating

Partials live in `public/partials/*.hbs` and are processed by `vite-plugin-handlebars`. Per-page SEO metadata (title, description, keywords, canonical, OG image) is defined in the `meta` object in `vite.config.ts` and injected into templates via a `context()` function that matches on file path.

### Seasonal Banners

Holiday/vacation banners (`vacation.hbs`, `xmas.hbs`) are toggled by manually adding/removing `{{> vacation}}` or `{{> xmas}}` in `index.html`. There is no date-based automation.

### Single CSS File

All styles in `src/assets/styles/styles.css` (~1430 lines, plain CSS). Uses CSS custom properties for theming (`--c-primary`, `--c-secondary`, `--c-accent`, etc.). No preprocessor. Responsive breakpoints at 900px, 768px, and 640px.

### Single TypeScript Entry

`src/main.ts` (~378 lines) handles all interactivity:
- **Scroll animations** — IntersectionObserver adds `.visible` class; supports `data-stagger` containers
- **Flip cards** — 3D CSS flip interaction for `.kacheln .flip_container`
- **Navigation** — Mobile hamburger, scroll-spy active state via IntersectionObserver
- **Seals popover** — Native HTML Popover API with `SEALS` registry keyed by `data-seal`; per-element overrides via `data-title`, `data-desc`, `data-holder`, `data-link` attributes

### Static Assets

Images and vendored libraries live in `public/` and are copied verbatim to `dist/`. Font Awesome 7 is bundled via npm import. Open Sans variable font is self-hosted from `src/assets/fonts/`.

### Deployment

FTP-based via `lftp` in `deploy.sh`. Hosted on Dogado shared hosting with Apache (`.htaccess` for 404 routing). No CI/CD pipeline — deployment is manual from a developer machine.

## Key Conventions

- Content and code comments are in **German**; commit messages in **English**
- Accessibility: `aria-*` attributes, `.sr-only` class, `tabindex="0"` on interactive elements, `aria-current="page"` on nav links
- Third-party scripts (CCM19 cookie consent, ProvenExpert widget) are loaded inline in HTML templates
- A commented-out Leaflet map implementation exists in `main.ts` and vendored files remain in `public/leaflet/`
