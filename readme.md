# Projekt M Immobilien – Website

Statische Multi-Page-Website für die **Projekt M Immobilien GmbH** (München), live unter [projektmimmobilien.de](https://projektmimmobilien.de).

## Tech-Stack

- **Vite** – Build-Tool mit Multi-Page-Setup (auto-discovery aller `index.html`)
- **Handlebars** – Templating via `vite-plugin-handlebars` (Partials in `public/partials/`)
- **TypeScript** (strict) – Einzelner Einstiegspunkt `src/main.ts`
- **Plain CSS** – Alle Styles in `src/assets/styles/styles.css`, CSS Custom Properties
- **Kein Framework** – Vanilla HTML/CSS/JS

## Commands

```bash
npm run dev          # Vite Dev-Server starten (netzwerkweit via host: true)
npm run build        # Typecheck (tsc) + Vite Build → dist/
npm run typecheck    # Nur TypeScript-Prüfung
npm run preview      # Produktions-Build lokal ansehen
npm run deploy       # Build + FTP-Upload via deploy.sh (benötigt .env mit FTP-Daten)
```

## Architektur

### Multi-Page-Setup
Jede Seite ist eine eigenständige `index.html` in einem eigenen Verzeichnis (Clean URLs). Vite entdeckt alle `**/index.html` automatisch via `fast-glob` in `vite.config.ts`.

Seiten: `/` (Startseite), `/datenschutz/`, `/impressum/`, `/404/`

### Handlebars-Partials
Partials liegen in `public/partials/*.hbs`. SEO-Metadaten (Title, Description, Canonical, OG-Image) werden pro Seite im `meta`-Objekt in `vite.config.ts` definiert und per `context()`-Funktion injiziert.

### Single CSS & TypeScript
- **CSS**: `src/assets/styles/styles.css` – Responsive Breakpoints bei 900px, 768px, 640px
- **TypeScript**: `src/main.ts` – Scroll-Animationen, Flip Cards, Navigation, Siegel-Popover

### Statische Assets
Bilder und Vendor-Dateien in `public/` werden beim Build nach `dist/` kopiert. Font Awesome 7 via npm, Open Sans (Variable) self-hosted aus `src/assets/fonts/`.

## Deployment

FTP-basiert via `lftp` in `deploy.sh`. Hosting auf Dogado Shared Hosting mit Apache (`.htaccess` für 404-Routing, WebP/AVIF Content-Negotiation, Security-Header).
