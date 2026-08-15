# SEO-/GEO-Audit: Projekt M Immobilien Codebasis

Stand: 14.08.2026

Projekt: `/Users/tgermer/git/projektmimmobiliende/`

Scope: Astro-Codebasis, vorhandene Build-Ausgabe in `dist/`, Server-/Deployment-Konfiguration, öffentliche Live-Signale und externe Entity-Profile. Es wurden keine Änderungen am Produktivcode vorgenommen. Die vorhandenen uncommitted Änderungen an `src/components/Hero.astro`, `src/pages/index.astro` und `src/assets/img/2026-07_shooting/` wurden nur gelesen.

## 1. Kurzfazit

Die Website hat eine solide technische Basis: Astro Static Site Generation, saubere Canonicals, automatische Sitemap, HTTPS-Redirects, Sicherheitsheader, Bildoptimierung über Astro Assets, `robots.txt`, Open Graph und JSON-LD. Für eine kleine, hochwertige Boutique-Makler-Website ist das Fundament gut.

Das zentrale SEO-/GEO-Problem liegt nicht darin, dass keine öffentlichen Immobilienangebote gelistet werden. Das ist mit dem Geschäftsmodell als diskret arbeitender Boutique-Immobilienmakler vereinbar und sollte strategisch genutzt werden. Das Problem liegt in der Informationsarchitektur: Fast alle geschäftsrelevanten Suchintentionen liegen auf einer einzigen Startseite. Die Sitemap enthält aktuell nur fünf URLs, davon drei rechtliche/formale Seiten. Es fehlen indexierbare Seiten für Leistungen, Standorte, Personen, Bewertungs-/Gutachterkompetenz, diskrete/off-market Vermittlung und lokal-fachliche Ratgeberinhalte.

Für AI Search/GEO ist Projekt M grundsätzlich gut geeignet, weil die Marke echte Entitätssignale besitzt: Firmenadresse, Geschäftsführer, Gutachterqualifikationen, IVD/DIA/HypZert/Sprengnetter/DEKRA-Signale, ProvenExpert, ImmoScout24, München und Landshut. Diese Signale sind aber noch zu stark auf Bilder, Popover und eine globale JSON-LD-Struktur verteilt. AI-Systeme und Suchmaschinen brauchen klarere einzelne URLs, präzise Antwortabschnitte, verknüpfte Personen-/Service-Entitäten und überprüfbare externe Profile.

## 2. Geprüfte Evidenz

### Lokale Codebasis

- `astro.config.mjs`: Astro Static Build, `site`, `trailingSlash`, Sitemap-Integration, Sharp Image Service.
- `src/layouts/BaseLayout.astro`: globale Metadaten, Canonical, Robots, Open Graph, JSON-LD `RealEstateAgent`, Breadcrumbs.
- `src/layouts/LegalLayout.astro`: rechtliche Seiten erben globale Layout-SEO-Defaults.
- `src/pages/index.astro`: Startseite mit Leistungen, Team, Kompetenzen, IVD, Immobilienangebote/Diskretion, Standorte, CTA, ProvenExpert, Karte.
- `src/pages/impressum.astro`, `src/pages/datenschutz.astro`, `src/pages/widerruf.astro`, `src/pages/widerruf/danke.astro`, `src/pages/404.astro`.
- `src/components/Hero.astro`, `Navigation.astro`, `Footer.astro`, `SealsPopover.astro`.
- `src/data/provenexpert.ts`, `src/data/seals.json`.
- `public/robots.txt`, `public/.htaccess`.
- `dist/sitemap-index.xml`, `dist/sitemap-0.xml`, `dist/.htaccess`, generierte HTML-Dateien.

### Öffentliche Quellen und Orientierung

- Live-Website: `https://projektmimmobilien.de/`
- `https://projektmimmobilien.de/robots.txt`
- `https://projektmimmobilien.de/sitemap-index.xml`
- `https://projektmimmobilien.de/sitemap-0.xml`
- ImmoScout24-Profil: `https://www.immobilienscout24.de/anbieter/profil/projekt-m-immobilien-gmbh`
- ProvenExpert-Profil: `https://www.provenexpert.com/de-de/projekt-m-immobilien-gmbh/`
- Google Search Central: AI Search Guidance, SEO Starter Guide, Helpful Content/E-E-A-T
- Google Business Profile Guidelines
- Google Review-Rich-Results-Hinweis zu self-serving reviews
- Schema.org `LocalBusiness`

## 3. Ist-Zustand

### Tech-Stack

- Astro 6.1.2, statischer Output.
- TypeScript strict über `astro check`.
- Kein Frontend-Framework, Plain CSS.
- `@astrojs/sitemap` erzeugt die XML-Sitemap.
- Astro Assets/Sharp optimieren Bilder.
- Deployment per FTP aus `dist/`.

Evidenz:

- `astro.config.mjs` setzt `site: 'https://projektmimmobilien.de'`, `output: 'static'`, `trailingSlash: 'always'`, `build.format: 'directory'`, `compressHTML: true`, `@astrojs/sitemap` und Sharp Image Service.
- `package.json` enthält `npm run build` als `astro check && astro build`.

### Aktuelle URL-Struktur

Die generierte Sitemap enthält:

- `/`
- `/datenschutz/`
- `/impressum/`
- `/widerruf/`
- `/widerruf/danke/`

Bewertung:

- Für eine Website mit mehreren Leistungsfeldern und zwei Zielmärkten ist die URL-Struktur zu klein.
- Geschäftsrelevante Themen sind nicht gezielt indexierbar.
- `/widerruf/danke/` ist eine Bestätigungsseite und sollte nicht in den Index.

### Aktuelle Startseite

Enthaltene Themen:

- Immobiliengutachter, Verkehrswert-/Marktwertgutachten.
- Immobilienmakler, Verkauf.
- Immobilienmediator.
- Wohnflächenberechnung in Vorbereitung.
- Team: Rüdiger Neuer, Jürgen Gebhard.
- Mitgliedschaften, Fortbildungen, Qualifikationen.
- IVD.
- Diskrete Immobilienvermittlung ohne öffentliches Schaufenster.
- Eigentumswohnungen, Einfamilienhäuser, Mehrfamilienhäuser, Grundstücke.
- Nachhaltigkeit.
- Auszeichnungen.
- Standorte München/Schwabing und Landshut.
- Kontakt/Telefon.
- ProvenExpert und Karte consent-gated.

Bewertung:

- Inhaltlich starkes Rohmaterial.
- Für Nutzer wirkt die Seite vertrauensbildend.
- Für SEO/GEO ist sie zu verdichtet: viele Suchintentionen konkurrieren auf einer URL.

## 4. Technical SEO

### Stärken

- Canonical-Unterstützung im Layout.
- `meta robots` im Layout steuerbar.
- Development-Builds werden bei abweichender `BASE_URL` automatisch `noindex, nofollow`.
- Sitemap-Integration vorhanden.
- `robots.txt` erlaubt Crawling und nennt die Sitemap.
- HTTPS-Redirect in `.htaccess`.
- Sicherheitsheader und HSTS vorhanden.
- Langfristiges Asset-Caching für CSS, JS, Fonts und Bilder.
- HTML-Caching bewusst kurz: `no-cache, must-revalidate`.
- 404-Seite ist `noindex, nofollow`.

### Befunde

#### P0: Danke-Seite ist indexierbar und in Sitemap

Evidenz:

- `src/pages/widerruf/danke.astro` nutzt `LegalLayout` ohne `robots`-Override.
- `src/layouts/LegalLayout.astro` akzeptiert aktuell keine `robots`-Prop und reicht sie nicht an `BaseLayout` durch.
- `BaseLayout` setzt Default `robots = 'index, follow'`.
- `dist/sitemap-0.xml` enthält `https://projektmimmobilien.de/widerruf/danke/`.

Risiko:

- Niedrige Indexqualität.
- Google kann eine formularbezogene Danke-Seite indexieren.
- AI-/Suchsysteme erhalten eine nutzlose URL als crawlbare Seite.

Soll:

- `/widerruf/danke/` auf `noindex, nofollow` oder mindestens `noindex, follow`.
- Aus Sitemap entfernen, entweder über Astro-Sitemap-Filter oder durch Seitenausschluss.

#### P1: Sitemap spiegelt keine Business-Architektur wider

Evidenz:

- Es gibt keine `src/pages/leistungen/...`, `src/pages/standorte/...`, `src/pages/team/...`, `src/pages/ratgeber/...`.

Risiko:

- Kein Ranking-Ziel für High-Intent-Suchen.
- Interne Verlinkung bleibt Anker-Navigation statt crawlbarer Themenstruktur.

Soll:

- Dedizierte, indexierbare Seitencluster aufbauen.

#### P1: Globales JSON-LD ist zu pauschal

Evidenz:

- `src/layouts/BaseLayout.astro` gibt auf jeder Seite ein `RealEstateAgent`-Schema aus.
- `url` wird je Seite auf den jeweiligen Canonical gesetzt.
- `description` wird je Seite eingesetzt, auch bei Datenschutz/Impressum/Widerruf.
- `hasOfferCatalog` und `aggregateRating` erscheinen dadurch auch auf rechtlichen Seiten.

Risiko:

- Strukturierte Daten sind technisch nicht zwingend falsch, aber semantisch unscharf.
- Eine Datenschutzseite ist nicht selbst ein Immobilienmakler-Angebotskatalog.
- AI-/Suchsysteme erhalten weniger klare Entity-Signale.

Soll:

- Global nur `Organization`/`RealEstateAgent` als Website-Entity oder auf Start-/Kontaktseite.
- Service-Schema nur auf Service-Seiten.
- Person-Schema nur auf Personenseiten.
- Breadcrumbs mit vollständiger `item`-URL je ListItem.

#### P1: `aggregateRating` im LocalBusiness-Markup ist strategisch schwach

Evidenz:

- `src/data/provenexpert.ts` zieht ProvenExpert-Bewertungen beim Build und fallbackt auf feste Werte.
- `BaseLayout` gibt diese Werte als `aggregateRating` im `RealEstateAgent`-Schema aus.

Bewertung:

- Als interne Trust-Anzeige kann ProvenExpert wertvoll sein.
- Für Google-Rich-Results ist das aber nicht als zuverlässiger Hebel einzuplanen, weil Google self-serving reviews für `LocalBusiness`/`Organization` nicht als Review Rich Results ausspielt.

Soll:

- Bewertungen sichtbar und verlinkt nutzen.
- Schema-Markup für Ratings nicht als primären SEO-Nutzen bewerten.
- Prüfen, ob `aggregateRating` im Business-Schema entfernt oder nur sehr bewusst eingesetzt wird.

#### P2: Build hängt potenziell an externer ProvenExpert-Abfrage

Evidenz:

- `getProvenExpertRating()` führt `fetch("https://www.provenexpert.com/de-de/projekt-m-immobilien-gmbh/")` während des Builds aus.
- Es gibt Fallbackwerte und Logging.

Risiko:

- Builds hängen von externer Erreichbarkeit, HTML-Struktur und Netzwerk ab.
- Werte können veralten, wenn Fallback greift.

Soll:

- Für SEO-Entscheidung nicht kritisch.
- Mittelfristig: Bewertungen manuell gepflegt, über API, oder als optionaler Build-Step mit klarer Fehlerbehandlung.

## 5. Informationsarchitektur

### Ist

Die Hauptnavigation verweist auf Startseiten-Anker:

- `#leistungen`
- `#team`
- `#kompetenzen`
- `#immobilienangebote`
- `#standorte`
- `#callToAction`

Der Footer wiederholt diese Anker und ergänzt Impressum, Datenschutz, Widerruf.

### Problem

Anker strukturieren die Startseite für Nutzer, erzeugen aber keine separaten Suchergebnis-Ziele. Für Suchmaschinen und AI Search bleibt Projekt M eine einzelne große Seite mit vielen Themen statt eines klaren Entity-Graphen aus Leistungen, Orten, Personen und Expertise.

### Soll

Die Startseite bleibt Marken- und Vertrauens-Hub. Darunter entstehen wenige, hochwertige Seiten:

- Leistungen
- Standorte/Regionen
- Team/Experten
- Kompetenzen/Zertifizierungen
- Diskrete Vermittlung
- Bewertungs-/Gutachtercluster
- Selektiver Ratgeber

## 6. Onpage SEO

### Startseite

Aktuell:

- Title: `Projekt M Immobilien – Ihr Immobilienexperte in München`
- Description: `Projekt M Immobilien erstellt zertifizierte Immobiliengutachten, verkauft Immobilien mit Herz und vermittelt in Konflikten mit Fachverstand. Jetzt beraten lassen!`
- H1: `Willkommen bei der Projekt M Immobilien`
- Lead: `Ihr starker Partner rund um die Immobilie in München und Landshut.`

Bewertung:

- Title ist solide, aber München-lastig und unspezifisch.
- H1 ist freundlich, aber nicht suchintent- oder angebotsorientiert.
- Landshut, Boutique-Positionierung, diskreter Verkauf und Gutachterkompetenz sind nicht im Title/H1 sichtbar.
- `meta keywords` wird gesetzt; moderne Suchmaschinen werten dieses Feld praktisch nicht als Rankinghebel. Es ist nicht schädlich, aber auch kein Schwerpunkt.

Soll:

- Startseite stärker als Marke und Leistungsversprechen positionieren.
- Beispielrichtung: `Projekt M Immobilien – Immobilienbewertung & diskreter Verkauf in München und Landshut`.
- H1 sollte konkrete Relevanz tragen, z. B. `Immobilienbewertung und diskreter Immobilienverkauf in München und Landshut`.

### Rechtliche Seiten

Aktuell:

- Impressum und Datenschutz haben eigene Titles und Canonicals.
- Descriptions sind sehr kurz.
- Sie erben globales Business-JSON-LD.

Soll:

- Rechtliche Seiten müssen indexierbar sein können, sind aber keine SEO-Zielseiten.
- Kein Angebots-/Rating-Schema auf diesen Seiten.

## 7. Local SEO

### Ist

Starke lokale Signale:

- Firmenadresse München: Krumbacherstraße 5, 80798 München.
- Stadtteilbezug Schwabing, Josephsplatz, Hohenzollernplatz, Elisabethmarkt.
- Landshut wird als besonderer Zielmarkt erklärt.
- Jürgen Gebhard wird mit Landshut-Verbindung erwähnt.
- Telefonnummer und E-Mail sind konsistent sichtbar.
- Externe Profile bestätigen Name, Adresse, Telefon und Leistungen.

Schwächen:

- Keine eigene Standortseite München/Schwabing.
- Keine eigene Standort-/Regionseite Landshut.
- Landshut ist als Marktgebiet stark, aber nicht als eigene URL zitierbar.
- Google Business Profile-Daten konnten aus der Codebasis nicht geprüft werden.

Soll:

- `/standorte/muenchen/` oder `/standorte/muenchen-schwabing/`
- `/standorte/landshut/`
- Auf Standortseiten: lokale Erfahrung, typische Objektarten, Marktgebiet, Ansprechpartner, Ablauf, FAQs, interne Links zu Leistungen.
- Landshut ehrlich als Servicegebiet/Region darstellen, falls kein dauerhaft besetztes Büro besteht.

## 8. E-E-A-T und Entity-Signale

### Stärken

- Rüdiger Neuer ist klar als Inhaber/Geschäftsführer, Immobiliengutachter und Mediator genannt.
- Jürgen Gebhard ist als Immobilienmakler genannt.
- Zertifikate/Siegel: DEKRA D1, DIA, HypZert, Sprengnetter, IVD, vdiv, Haus & Grund, ImmoScout24, immowelt.
- Impressum enthält HRB, Amtsgericht, USt-ID, §34c, IHK, Berufshaftpflicht.
- `seals.json` enthält gute erklärende Texte für viele Siegel.
- Einige Zertifikate haben Validierungslinks, z. B. DIA.

### Schwächen

- Keine eigene Personenseite für Rüdiger Neuer.
- Keine eigene Personenseite für Jürgen Gebhard.
- Zertifizierungen sind überwiegend in Popover-/Bildkontexten, nicht auf einer dauerhaft sichtbaren, crawlbaren Kompetenzseite.
- Kein klarer Autoren-/Reviewer-Mechanismus für künftige Fachinhalte.
- Keine strukturierte Verbindung zwischen `Person`, `Service`, `RealEstateAgent`, Zertifikaten und Standortseiten.

### Soll

- `/team/ruediger-neuer/`: Rolle, Qualifikationen, Zertifizierungen, Gutachterkompetenz, Mediation, Bewertungsmethodik, Kontakt.
- `/team/juergen-gebhard/`: Maklerrolle, Landshut-Netzwerk, Objektarten, regionale Expertise.
- `/kompetenzen/`: Zertifizierungen textlich sichtbar erklären und extern validieren.
- JSON-LD: `Person`, `knowsAbout`, `hasCredential` soweit passend, `memberOf`, `worksFor`.

## 9. Strukturierte Daten

### Ist

Globales `RealEstateAgent`-Schema:

- Name, Bilder, Beschreibung.
- Adresse, Telefon, E-Mail, Geo.
- `areaServed`: München, Landshut.
- `sameAs`: ProvenExpert, ImmoScout24, immowelt, LinkedIn.
- `knowsAbout`: Immobilienmakler, Gutachter, Verkehrswertgutachten, Mediation usw.
- `aggregateRating`.
- `hasOfferCatalog`.

Breadcrumb-Schema:

- Wird für Seiten mit `breadcrumbTitle` erzeugt.
- Zweites ListItem enthält nur `name`, kein `item`.

### Soll

Startseite:

- `RealEstateAgent` oder `LocalBusiness` als Hauptentity.
- `WebSite` optional.
- `sameAs` nur mit verifizierten, erreichbaren Profilen.

Service-Seiten:

- `Service` mit `provider`, `areaServed`, `serviceType`, `url`.

Personenseiten:

- `Person` mit `worksFor`, `jobTitle`, `knowsAbout`, `sameAs`/Credential-Links.

Standortseiten:

- `Place`/`LocalBusiness`-Kontext vorsichtig nutzen.
- Keine künstliche zweite Adresse für Landshut, wenn kein offizieller Standort existiert.

Breadcrumbs:

- Vollständige URLs für alle Breadcrumb-Items.

## 10. Content Gaps

### Bewertungs-/Gutachterkompetenz

Sehr hohe Priorität:

- Immobilienbewertung München
- Immobiliengutachter München
- Verkehrswertgutachten München
- Marktwertgutachten München
- Immobilienbewertung Landshut
- Verkehrswertgutachten Landshut
- Unterschied Verkehrswertgutachten, Marktwertgutachten, Kurzgutachten
- Ablauf einer Immobilienbewertung
- Benötigte Unterlagen für ein Gutachten
- Immobilienbewertung bei Erbe, Scheidung, Verkauf, Finanzierung

### Diskrete/off-market Vermittlung

Sehr hohe Priorität:

- Diskreter Immobilienverkauf München
- Off-Market Immobilienverkauf München
- Diskreter Immobilienverkauf Landshut
- Verkauf ohne öffentliche Portale
- Käuferqualifizierung und Netzwerkvermarktung
- Diskretion bei Nachlass, Scheidung, vermieteten Objekten, hochwertigen Immobilien

### Makler-/Objektarten

Hohe Priorität:

- Immobilienmakler München/Schwabing
- Immobilienmakler Landshut
- Wohnung verkaufen München
- Haus verkaufen München
- Grundstück verkaufen Landshut
- Mehrfamilienhaus verkaufen München
- Kapitalanlage/Mehrfamilienhaus bewerten und verkaufen

### Mediation

Mittlere bis hohe Priorität:

- Immobilienmediation München
- Mediation bei Erbengemeinschaft
- Mediation bei Scheidungsimmobilien
- Konfliktlösung bei Immobilienverkauf

### Nicht empfohlen

- Viele dünne Stadtteilseiten ohne echten Inhalt.
- Öffentliche Angebotsseiten nur als SEO-Kulisse.
- Generische Ratgeber ohne Projekt-M-Erfahrung, lokale Einordnung oder fachlichen Mehrwert.

## 11. Diskrete Vermittlung als strategischer SEO-Hebel

Das Fehlen öffentlicher Immobilienangebote ist kein Defizit, wenn es aktiv erklärt wird. Die vorhandene Startseite macht das bereits gut: Diskretion, Netzwerk, vorgemerkte Suchkunden und Qualität vor Reichweite werden beschrieben.

Der nächste Schritt ist eine eigene Seite:

- Titel: `Diskreter Immobilienverkauf in München und Landshut`
- Zielgruppe: Eigentümer hochwertiger, sensibler oder persönlich geprägter Immobilien.
- Inhalte: Wann Diskretion sinnvoll ist, Ablauf, Käuferprüfung, Unterlagen, Netzwerk, Risiken öffentlicher Vermarktung, Kombination aus Gutachten und Verkaufsstrategie.
- CTA: persönliches Beratungsgespräch.
- Interne Links: Immobilienbewertung, Immobilienverkauf, München, Landshut, Rüdiger Neuer, Jürgen Gebhard.

## 12. Immobilienbewertung/Gutachter-Kompetenz

Dies ist vermutlich das stärkste organische Differenzierungsfeld der Website.

Warum:

- Fachliche Zertifizierungen sind vorhanden.
- Immobilienbewertung hat klare Suchintention.
- Gutachten schaffen Vertrauen auch für spätere Verkaufsmandate.
- Boutique-Positionierung passt zu qualifizierter, individueller Bewertung.
- AI Search kann fachlich gut strukturierte Bewertungsinhalte zitieren.

Empfohlener Cluster:

- `/leistungen/immobilienbewertung/`
- `/leistungen/verkehrswertgutachten/`
- `/leistungen/marktwertgutachten/`
- `/immobilienbewertung-muenchen/`
- `/immobiliengutachter-muenchen/`
- `/immobilienbewertung-landshut/`
- `/team/ruediger-neuer/`

## 13. AI Search/GEO

Google selbst beschreibt generative Suche als auf dem klassischen Suchindex und öffentlichen, crawlbaren Seiten aufbauend. Für Projekt M heißt das: Es braucht keine separate "AI-Magie", sondern klare, indexierbare, gut strukturierte und vertrauenswürdige Seiten.

### Gute Ausgangslage

- Crawlbare statische HTML-Seiten.
- Echte lokale Entität.
- Echte Personen und Qualifikationen.
- Externe Profile.
- Klare Spezialisierung.
- Verifizierbare Adresse und Kontaktdaten.

### Lücken für Zitierfähigkeit

- Zu wenige URLs.
- Zu wenige direkt zitierbare Antwortabschnitte.
- Keine Personenseiten.
- Keine Service-Seiten mit Ablauf/Kosten/Unterlagen/Abgrenzung.
- Zertifikate nicht ausreichend als sichtbarer Hauptinhalt ausgearbeitet.

### Soll

Jede Kernfrage sollte eine eindeutige URL haben:

- Wer erstellt Verkehrswertgutachten in München?
- Was ist der Unterschied zwischen Marktwertgutachten und Verkehrswertgutachten?
- Wie verkauft man eine Immobilie diskret in München?
- Wer ist Immobiliengutachter Rüdiger Neuer?
- Unterstützt Projekt M Immobilien auch in Landshut?
- Welche Unterlagen braucht man für eine Immobilienbewertung?

## 14. Vorgeschlagene Seitenarchitektur

### Basis

- `/` - Startseite: Marke, Boutique-Positionierung, München/Landshut, Gutachter + diskreter Verkauf.
- `/leistungen/` - Leistungs-Hub.
- `/standorte/` - Regionen-Hub.
- `/team/` - Team-Hub.
- `/kompetenzen/` - Zertifizierungen, Mitgliedschaften, Qualität.
- `/kontakt/` - Kontakt, Telefon, Termin.

### Leistungen

- `/leistungen/immobilienbewertung/`
- `/leistungen/verkehrswertgutachten/`
- `/leistungen/marktwertgutachten/`
- `/leistungen/immobiliengutachter/`
- `/leistungen/immobilienverkauf/`
- `/leistungen/diskreter-immobilienverkauf/`
- `/leistungen/immobilienmediation/`
- `/leistungen/wohnflaechenberechnung/`

### Standorte und lokale Seiten

- `/standorte/muenchen/`
- `/standorte/muenchen-schwabing/`
- `/standorte/landshut/`

### High-Intent-Kombinationen

Nur anlegen, wenn echte individuelle Inhalte vorhanden sind:

- `/immobilienbewertung-muenchen/`
- `/immobiliengutachter-muenchen/`
- `/verkehrswertgutachten-muenchen/`
- `/immobilienmakler-muenchen/`
- `/immobilienmakler-landshut/`
- `/immobilienbewertung-landshut/`
- `/grundstueck-verkaufen-landshut/`
- `/diskreter-immobilienverkauf-muenchen/`

### Personen

- `/team/ruediger-neuer/`
- `/team/juergen-gebhard/`

### Ratgeber

- `/ratgeber/verkehrswertgutachten-marktwertgutachten-unterschied/`
- `/ratgeber/unterlagen-immobilienbewertung/`
- `/ratgeber/immobilie-diskret-verkaufen/`
- `/ratgeber/nachlassimmobilie-bewerten-verkaufen/`
- `/ratgeber/scheidungsimmobilie-mediation-bewertung/`

## 15. Maßnahmen-Backlog

### P0 - Indexhygiene und technische Klarheit

| Maßnahme | Aufwand | Nutzen | Evidenz/Begründung |
|---|---:|---:|---|
| `/widerruf/danke/` auf `noindex` setzen | S | Mittel | Danke-Seite erbt `index, follow`. |
| `/widerruf/danke/` aus Sitemap entfernen | S-M | Mittel | Generierte Sitemap enthält die URL. |
| `LegalLayout` um `robots`-Prop erweitern | S | Mittel | Aktuell kann Danke-Seite Robots nicht durchreichen. |
| Globales JSON-LD auf rechtlichen Seiten reduzieren | M | Mittel | `RealEstateAgent` + OfferCatalog erscheint überall. |
| BreadcrumbList mit vollständigen `item`-URLs ausgeben | S | Niedrig-Mittel | Zweites Breadcrumb-Item hat aktuell keine URL. |
| Search Console/Bing Webmaster Tools prüfen | S | Hoch | Ohne echte Querydaten bleibt Priorisierung teilweise hypothetisch. |

### P1 - Sichtbarkeitsarchitektur

| Maßnahme | Aufwand | Nutzen | Evidenz/Begründung |
|---|---:|---:|---|
| Leistungs-Hub `/leistungen/` erstellen | M | Hoch | Navigation ist aktuell nur Ankerstruktur. |
| Bewertungs-/Gutachtercluster erstellen | M-L | Sehr hoch | Stärkstes fachliches Differenzierungsfeld. |
| Standortseiten München/Schwabing und Landshut erstellen | M | Hoch | Local SEO braucht eigene lokale URLs. |
| Seite `Diskreter Immobilienverkauf` erstellen | M | Hoch | Passt exakt zum Boutique-Modell ohne Angebotslisten. |
| Personenseiten erstellen | M | Hoch | E-E-A-T und AI-Zitierfähigkeit deutlich stärker. |
| Interne Verlinkung von Ankern auf echte Seiten erweitern | M | Hoch | Crawling, Nutzerführung und Themencluster verbessern sich. |
| Seitenbezogenes Service-/Person-/Breadcrumb-Schema ergänzen | M | Mittel-Hoch | Aktuelles Schema ist global zu pauschal. |

### P2 - Autorität und Content-Ausbau

| Maßnahme | Aufwand | Nutzen | Evidenz/Begründung |
|---|---:|---:|---|
| Ratgeber zu Bewertung, Unterlagen, Diskretion, Erbe/Scheidung | M-L | Mittel-Hoch | Nur hochwertig und fachlich konkret erstellen. |
| Anonymisierte Referenzen/Projektbeispiele | M | Hoch | Boutique-Vertrauen ohne öffentliche Angebotslisten. |
| Kompetenzseite mit sichtbaren Zertifikatserklärungen | M | Mittel-Hoch | `seals.json` enthält bereits gute Rohtexte. |
| Externe Profile harmonisieren | M | Hoch | Local Entity Matching, AI und Google Business Profile profitieren. |
| `llms.txt` oder AI-Quellenübersicht testen | S | Niedrig-Mittel | Experimentell, nur Ergänzung zu klassischer SEO. |
| Lokale/Fach-Citations aufbauen | M-L | Mittel-Hoch | IVD, lokale Presse, Partner, Fachbeiträge stärken Autorität. |

## 16. Empfohlene Umsetzungsreihenfolge

1. P0-Indexhygiene: Danke-Seite `noindex`, aus Sitemap entfernen, JSON-LD auf Utility-Seiten entschlacken.
2. Startseite Title/H1/Description strategisch schärfen.
3. Bewertungs-/Gutachterseiten und Rüdiger-Neuer-Seite erstellen.
4. Standortseiten München/Schwabing und Landshut erstellen.
5. Diskreter Immobilienverkauf als eigene Seite erstellen.
6. Jürgen-Gebhard-Seite und Makler-/Landshut-Cluster ausbauen.
7. Erst danach Ratgeber und Referenzen.

## 17. Messplan

Vor Umsetzung:

- Google Search Console: indexierte Seiten, Impressionen, Klicks, CTR, Querygruppen.
- Bing Webmaster Tools.
- Aktuelle Rankings für Kernbegriffe in München und Landshut.
- Local-Pack-Sichtbarkeit.
- Google Business Profile: Anrufe, Website-Klicks, Routen, Suchbegriffe.
- ProvenExpert/ImmoScout24/Immowelt/LinkedIn Konsistenz.

Nach Umsetzung:

- Indexierung neuer Seiten.
- Impressionen je Themencluster.
- Rankingentwicklung für Bewertungs-, Gutachter-, Makler- und Diskretionsbegriffe.
- Leadqualität über Telefon/E-Mail/Kontakt.
- Manuelle AI-Search-Tests mit konkreten Fragen.
- Crawling-/Schema-Validierung.

## 18. Konkrete Code-Hinweise ohne Umsetzung

Diese Punkte sind als spätere Umsetzungshinweise gedacht, nicht als bereits ausgeführte Änderungen:

- `src/layouts/LegalLayout.astro`: `robots?: string` in Props aufnehmen und an `BaseLayout` weiterreichen.
- `src/pages/widerruf/danke.astro`: `robots="noindex, nofollow"` setzen.
- `astro.config.mjs`: Sitemap-Filter für `/widerruf/danke/` prüfen.
- `src/layouts/BaseLayout.astro`: JSON-LD modularisieren, z. B. `organizationSchema`, `serviceSchema`, `personSchema`, `breadcrumbSchema`.
- `src/pages/index.astro`: Startseitenmetadaten und H1 schärfen.
- Neue Page-Struktur unter `src/pages/leistungen/`, `src/pages/standorte/`, `src/pages/team/`, `src/pages/ratgeber/`.
- Bestehende `src/data/seals.json`-Inhalte für eine echte Kompetenzseite wiederverwenden.

## 19. Quellen

- Google AI Search Guidance: `https://developers.google.com/search/docs/fundamentals/ai-optimization-guide`
- Google SEO Starter Guide: `https://developers.google.com/search/docs/fundamentals/seo-starter-guide`
- Google Helpful Content/E-E-A-T: `https://developers.google.com/search/docs/fundamentals/creating-helpful-content`
- Google Business Profile Guidelines: `https://support.google.com/business/answer/3038177`
- Google Review Rich Results/self-serving reviews: `https://developers.google.com/search/blog/2019/09/making-review-rich-results-more-helpful`
- Schema.org LocalBusiness: `https://schema.org/LocalBusiness`
- Live-Website: `https://projektmimmobilien.de/`
- ImmoScout24-Profil: `https://www.immobilienscout24.de/anbieter/profil/projekt-m-immobilien-gmbh`
- ProvenExpert-Profil: `https://www.provenexpert.com/de-de/projekt-m-immobilien-gmbh/`

