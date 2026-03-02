# Projekt M Immobilien – Website

Statische Multi-Page-Website für die **Projekt M Immobilien GmbH** (München), live unter [projektmimmobilien.de](https://projektmimmobilien.de).

## Tech-Stack

- **Astro** – Static Site Generator mit Multi-Page-Setup
- **TypeScript** (strict) – `astro check` als Code-Quality-Gate
- **Plain CSS** – CSS Custom Properties, kein Preprocessor
- **Kein Framework** – Vanilla HTML/CSS/JS

## Commands

```bash
npm install          # Abhängigkeiten installieren
npm run dev          # Astro Dev-Server starten
npm run build        # TypeScript-Check + Astro Build → dist/
npm run typecheck    # Nur astro check
npm run preview      # Produktions-Build lokal ansehen
npm run deploy       # Build + FTP-Upload via deploy.sh (benötigt .env mit FTP-Daten)
```

## Bilder

Rasterbilder (JPG, PNG) gehören nach `src/assets/img/`. Astro optimiert sie beim Build automatisch (Komprimierung, WebP/AVIF-Konvertierung).

### Wichtig: `width` und `height` immer angeben

Astro skaliert Bilder auf die per `width`/`height`-Prop angegebene Größe herunter. Ohne diese Angabe wird die **volle Originalauflösung** verwendet — auch bei 10 MB-Fotos.

```astro
<!-- Gut: Astro skaliert das Original auf 534px Breite herunter -->
<Image src={portrait} alt="..." width={534} height={800} />

<!-- Schlecht: volle Originalauflösung wird ausgeliefert -->
<Image src={portrait} alt="..." />
```

### Empfohlene Bildgrößen

| Verwendung | width (px) |
|---|---|
| Vollbild-Hintergründe (Hero, Banner) | 1600–2000 |
| Portraits, Karten, Content-Bilder | 500–800 |
| Siegel/Logos (PNG) | 300–500 |
| SVGs | Keine Optimierung nötig |

### `<Image>` vs. `<Picture>`

- `<Image>` — erzeugt eine optimierte WebP-Version. Für kleine Bilder (Siegel, Logos).
- `<Picture formats={['avif', 'webp']}>` — erzeugt AVIF + WebP + Fallback. Für große Bilder (Portraits, Hintergründe, Karten).

### Dateien in `public/`

Dateien in `public/img/` werden **nicht** optimiert und 1:1 ausgeliefert. Dort liegen nur SVGs, Favicons und Vendored Libraries (Leaflet).

## Icons

Icons werden als Inline-SVGs über die Komponente `src/components/Icon.astro` eingebunden (Font Awesome ist nicht mehr installiert).

### Vorhandene Icons

`envelope`, `phone-flip`, `xmark`, `scale-balanced`, `house-chimney`, `comments`, `ruler-combined`, `people-group`, `graduation-cap`, `award`, `seedling`, `triangle-exclamation`

### Neues Icon hinzufügen

1. Auf [fontawesome.com/icons](https://fontawesome.com/icons) das gewünschte Icon suchen (Solid-Stil)
2. SVG öffnen und `viewBox` sowie den `d`-Pfad aus dem `<path>`-Element kopieren
3. In `src/components/Icon.astro` in die `ICONS`-Map eintragen:

```typescript
'neuer-name': {
  viewBox: '0 0 512 512',
  d: 'M123 456...',
},
```

4. Verwenden:

```astro
import Icon from '../components/Icon.astro';

<Icon name="neuer-name" />
```

TypeScript prüft beim Build, dass nur gültige Icon-Namen verwendet werden.

## Deployment

FTP-basiert via `lftp` in `deploy.sh`. Gehostet auf Dogado Shared Hosting mit Apache (`.htaccess` für 404-Routing, HTTPS-Redirect, Caching-Header). Kein CI/CD — Deployment erfolgt manuell.
