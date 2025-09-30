/** import "leaflet/dist/leaflet.css"; */
import "@fortawesome/fontawesome-free/css/all.min.css";
/** import L from "leaflet"; */
import "./assets/styles/styles.css";

/** function initMap(): void {
    const el = document.getElementById("map");
    if (!el) return;

    const lat = 48.158335;
    const lng = 11.566951;
    const zoom = 15;

    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

    const map = L.map("map", {
        center: [lat, lng],
        zoom,
        dragging: !isTouch,
        scrollWheelZoom: false,
        touchZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: true,
        zoomControl: true,
    });

    map.attributionControl.setPrefix(false);

    L.Icon.Default.mergeOptions({
        iconRetinaUrl: "/leaflet/marker-icon-2x.png",
        iconUrl: "/leaflet/marker-icon.png",
        shadowUrl: "/leaflet/marker-shadow.png",
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        detectRetina: true,
        updateWhenIdle: true,
        keepBuffer: 1,
        crossOrigin: true,
        attribution: '© <a href="https://www.openstreetmap.de/copyright">OpenStreetMap</a>',
    }).addTo(map);

    L.marker([lat, lng]).addTo(map).bindPopup("<img src='/img/logo_pmi_web.svg' alt='Projekt M Immobilien GmbH – Logo' style='width:120px' />", { closeButton: false, maxWidth: 500, autoPan: true }).openPopup();

    map.whenReady(() => map.invalidateSize());
}
    */

function initScrollAnimations(): void {
    const animatedSel = ".fade-in, .slide-in-left, .slide-in-right, .scale-up, .flip_container";

    // 1) Observer für Einzel-Elemente außerhalb von Stagger-Containern
    const outsideStagger = Array.from(document.querySelectorAll<HTMLElement>(animatedSel)).filter((el) => !el.closest("[data-stagger]"));

    const ioSingle = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    (entry.target as HTMLElement).classList.add("visible");
                    obs.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: "0px 0px -20% 0px" }
    );

    outsideStagger.forEach((el) => ioSingle.observe(el));

    // 2) Observer für Stagger-Container: Kinder nacheinander sichtbar machen
    const ioStagger = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const container = entry.target as HTMLElement;
                const gap = parseInt(container.getAttribute("data-stagger") || "150", 10);
                const items = container.querySelectorAll<HTMLElement>(animatedSel);
                items.forEach((el, i) => {
                    el.style.transitionDelay = `${i * gap}ms`;
                    el.classList.add("visible");
                });
                obs.unobserve(container);
            });
        },
        { threshold: 0.1, rootMargin: "0px 0px -20% 0px" }
    );

    document.querySelectorAll<HTMLElement>("[data-stagger]").forEach((c) => ioStagger.observe(c));
}

function initFlipCards(): void {
    document.querySelectorAll(".kacheln .flip_container").forEach((card) => {
        const sRound = card.querySelector<HTMLElement>(".s_round");
        const bRound = card.querySelector<HTMLElement>(".b_round");
        const flip = card.querySelector<HTMLElement>(".flip_box");
        const sArrow = card.querySelector<HTMLElement>(".s_arrow");
        if (!sRound || !bRound || !flip || !sArrow) return;

        sRound.addEventListener("mouseenter", () => {
            bRound.classList.add("b_round_hover");
        });
        sRound.addEventListener("mouseleave", () => {
            bRound.classList.remove("b_round_hover");
        });
        sRound.addEventListener("click", (e) => {
            e.preventDefault();
            flip.classList.toggle("flipped");
            sRound.classList.add("s_round_click");
            sArrow.classList.toggle("s_arrow_rotate");
            bRound.classList.toggle("b_round_back_hover");
        });
        sRound.addEventListener("transitionend", () => {
            sRound.classList.remove("s_round_click");
            sRound.classList.add("s_round_back");
        });
    });
}

function initNav(): void {
    const btnEl = document.getElementById("nav-toggle-btn") as HTMLButtonElement | null;
    const menuEl = document.getElementById("primary-menu") as HTMLElement | null;
    if (!btnEl || !menuEl) return;

    const btn = btnEl as HTMLButtonElement;
    const menu = menuEl as HTMLElement;

    function setExpanded(expanded: boolean) {
        btn.setAttribute("aria-expanded", String(expanded));
        if (expanded) {
            menu.classList.add("open");
        } else {
            menu.classList.remove("open");
        }
    }

    btn.addEventListener("click", () => {
        const isOpen = btn.getAttribute("aria-expanded") === "true";
        setExpanded(!isOpen);
    });

    // ESC
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") setExpanded(false);
    });

    // Hash-Links
    const links = Array.from(menu.querySelectorAll<HTMLAnchorElement>('a[href*="#"]'));
    const getHash = (a: HTMLAnchorElement) => {
        try {
            return a.hash || new URL(a.getAttribute("href") || "", location.href).hash || "";
        } catch {
            return "";
        }
    };
    function setCurrent(link: HTMLAnchorElement | null) {
        links.forEach((a) => a.removeAttribute("aria-current"));
        if (link) link.setAttribute("aria-current", "page");
    }
    links.forEach((a) => {
        a.addEventListener("click", () => {
            setCurrent(a);
            setExpanded(false);
        });
    });
    if (location.hash) {
        const active = links.find((a) => getHash(a) === location.hash);
        if (active) setCurrent(active);
    }

    // Scroll-Spy
    const sections = Array.from(document.querySelectorAll<HTMLElement>("section[id]"));
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                    setCurrent(links.find((a) => getHash(a) === "#" + entry.target.id) || null);
                }
            });
        },
        { threshold: 0.5 }
    );
    sections.forEach((sec) => observer.observe(sec));
}

// ================== Popover: Siegel-Logik ==================
// Optional typing for the Popover API on HTMLElement
type PopoverApi = {
  showPopover?: () => void;
  hidePopover?: () => void;
};

type SealMeta = { title: string; desc: string; link?: string; holder?: string };

// Zentrale Registry für Siegeltexte. Nutzung: <img class="seal-logo" data-seal="<key>">
const SEALS: Record<string, SealMeta> = {
  din15733: {
    title: "Immobilienmakler zertifiziert nach DIN EN 15733",
    desc: "DIN EN 15733 ist die europaweit gültige Norm für Immobilienmakler. Sie bestätigt Mindestqualifikation, regelt Informationspflichten und verpflichtet zu einem Moralkodex inkl. Versicherung und Beschwerdemanagement. Zertifizierung freiwillig.",
    link: "",
  },
  "dekra-d1": {
    title: "DEKRA Sachverständige/r Immobilienbewertung D1",
    desc: "Das D1-Zertifikat bestätigt die besondere Fachkompetenz für die Bewertung von Standard-Einfamilien- und Zweifamilienhäusern. Geprüfte Sachverständige verfügen über fundiertes Fachwissen, rechtliche Kenntnisse und Praxiserfahrung in der Wertermittlung. Sie sind verpflichtet, ihr Wissen regelmäßig durch Fortbildungen und Rezertifizierungen nachzuweisen. Das Siegel schafft Vertrauen, dass Markt- und Verkehrswerte neutral, nachvollziehbar und nach anerkannten Standards ermittelt werden.",
    holder: "Rüdiger Neuer",
    link: "",
  },
  "sprengnetter-immowert": {
    title: "SPRENGNETTER Gesicherter ImmoWert",
    desc: "Dieses Qualitätssiegel bestätigt, dass die Wertermittlung auf geprüften Verfahren und aktueller Marktkenntnis basiert. Nur Sachverständige mit nachgewiesener Fachkompetenz und regelmäßiger Weiterbildung dürfen es führen.",
    link: "",
  },
  "sprengnetter-immomediator": {
    title: "SPRENGNETTER ImmoMediator",
    desc: "Das Siegel steht für geprüfte Kompetenz in Mediation und Konfliktlösung im Immobilienbereich. Zertifizierte Mediatoren helfen dabei, Streitigkeiten – zum Beispiel bei Erbe, Scheidung oder Bauprojekten – außergerichtlich, neutral und fair zu lösen.",
    link: "",
  },
  "sprengnetter-immobesichtiger": {
    title: "SPRENGNETTER ImmoBesichtiger – Schadenerkennung",
    desc: "Dieses Siegel weist die Qualifikation nach, bei Objektbesichtigungen Bauschäden und Risiken zuverlässig zu erkennen und korrekt zu dokumentieren. Damit wird sichergestellt, dass Immobilien sachgerecht bewertet und Folgekosten vermieden werden können.",
    link: "",
  },
  "dia-absolvent": {
    title: "Absolvent/in der Deutschen Immobilien-Akademie (DIA)",
    desc: "…",
    link: "",
  },
  "dia-zert-s": {
    title: "Zertifizierter Immobileingutachter S (DIAZert)",
    desc: "Zertifizierter Gutachter für die Markt- und Beleihungswertermittlung gemäß ImmoWertV und BelWertV von Standardimmobilien (S). Die Überprüfung erfolgte auf Basis des Programms Gutachter für Immobilienbewertung  und den normativen Grundlagen der DIA Consulting AG und unter Einhaltung der DIN EN ISO/IEC 17024.",
    holder: "Rüdiger Neuer",
    link: "https://www.diaconsulting.de/de/140/?credential=f2930293-be2a-4652-8850-f588d017f5fb",
  },
  "dia-zert-din15733": {
    title: "DIA Zert - Zertifiziert durch DIA Consulting AG nach EU-Norm DIN EN 15733",
    desc: "…",
    link: "",
  },
  "dia-zert-dipl-sach": {
    title: "Diplom-Sachverständiger (DIA)",
    desc: "Diplom-Sachverständiger (DIA) für die Bewertung von bebauten und unbebauten Grundstücken,für Mieten und Pachten",
    holder: "Rüdiger Neuer",
    link: "https://www.dia.de/de/657/?credential=6b8e7a13-3e59-4930-a8ee-e2c27078db58",
  },
  "hypzert-s": {
    title: "HypZert S – Real Estate Valuer",
    desc: "Zertifizierung für Immobiliengutachter:innen in der Finanzwirtschaft.",
    link: "",
  },
  "hypzert-gutachter": {
    title: "Wir beschäftigen HypZert Gutachter",
    desc: "HypZert ist die führende Zertifizierungsstelle für Immobiliengutachter:innen in der Finanzwirtschaft.",
    link: "",
  },
  ivd: {
    title: "Mitglied im IVD",
    desc: "Der Immobilienverband Deutschland e.V. (IVD) ist der Bundesverband der Immobilienberater:innen, Makler:innen, Verwalter:innen und Sachverständigen.",
    link: "",
  },
  "ivd-weiterbildung": {
    title: "IVD Immobilen-Weiterbildungssiegel",
    desc: "Das Siegel bestätigt die kontinuierliche Qualifizierung durch mindestens 15 Stunden anerkannte Fortbildung pro Jahr. Es steht für aktuelles Fachwissen, rechtliche Sicherheit und den Anspruch, Kundinnen und Kunden stets mit geprüfter Kompetenz zu begleiten.",
  },
  "ivd-marktforschung": {
    title: "Partner der IVD-Marktforschung",
    desc: "Das Siegel kennzeichnet Unternehmen, die aktiv an der Datenerhebung und Analyse des Immobilienmarktes mitwirken. Damit tragen sie zu belastbaren Marktberichten bei und erhalten selbst frühzeitig fundierte Informationen – ein Mehrwert für Kundinnen und Kunden.",
  },
  vdiv: {
    title: "vdiv – Die Immobilienverwalter Bayern",
    desc: "Der Verband der Immobilienverwalter Deutschland e. V. ist der Spitzenverband der Haus- und Immobilienverwalter:innen in der Bundesrepublik Deutschland. Er wurde 1988 gegründet und vertritt die Interessen von derzeit rund 3.600 Unternehmen in Deutschland.",
    link: "",
  },
  "immoscout24-silber": {
    title: "ImmoScout24 Silber Partner seit 2025",
    desc: "Immoscout24 ist die führende Online-Plattform für Wohn- und Gewerbeimmobilien in Deutschland.",
    link: "",
  },
  "immowelt-premium": {
    title: "immowelt Premium Partner",
    desc: "Immowelt ist der Betreiber der Immobilienportale Immowelt.de, Immonet.de und Immowelt.at sowie des Portals bauen.de und bietet eine hohe Reichweite für Anzeigen.",
    link: "",
  },
  "haus+grund": {
    title: "HAUS+GRUND MÜNCHEN – HAUS- UND GRUNDBESITZERVEREIN MÜNCHEN und Umgebung e.V.",
    desc: "Seit 1879 die Interessentenvertretung für Haus-, Wohnungs- und Grundeigentümer:innen.",
    link: "",
  },
};

function initSealsPopover(): void {
  const pop = document.getElementById("logo-popover") as (HTMLElement & PopoverApi) | null;
  if (!pop) return;

  const imgEl = document.getElementById("lp-img") as HTMLImageElement | null;
  const titleEl = document.getElementById("lp-title") as HTMLElement | null;
  const descEl = document.getElementById("lp-desc") as HTMLElement | null;
  const holderEl = document.getElementById("lp-certificateHolder") as HTMLElement | null;
  const linkWrap = document.getElementById("lp-link-wrap") as HTMLElement | null;
  const linkEl = document.getElementById("lp-link") as HTMLAnchorElement | null;

  function openPopoverFrom(el: HTMLElement): void {
    if (!pop || !imgEl || !titleEl || !descEl || !linkWrap || !linkEl) return;
    const key = (el as HTMLElement).dataset.seal || "";
    const meta = (key && SEALS[key]) ? SEALS[key] : ({} as SealMeta);
    const title = el.getAttribute("data-title") || meta.title || el.getAttribute("alt") || "Siegel";
    const desc  = el.getAttribute("data-desc")  || meta.desc  || "";
    const holder= el.getAttribute("data-holder")|| meta.holder || "";
    const href  = el.getAttribute("data-link")  || meta.link   || "";

    const img = el as HTMLImageElement;
    imgEl.src = (img.currentSrc || img.src || "");
    imgEl.alt = title;
    titleEl.textContent = title;
    descEl.textContent = desc;
    if (holderEl) {
      if (holder) { holderEl.textContent = "Ausgestellt für: " + holder; holderEl.hidden = false; }
      else { holderEl.hidden = true; }
    }
    if (href) { linkEl.href = href; linkWrap.hidden = false; } else { linkWrap.hidden = true; linkEl.removeAttribute("href"); }

    pop.showPopover?.();
    const closeBtn = pop.querySelector<HTMLElement>(".lp-close");
    closeBtn?.focus();
  }

  // Event-Delegation für Klick und Tastatur
  document.addEventListener("click", (e) => {
    const el = (e.target as HTMLElement | null)?.closest<HTMLElement>(".seal-logo");
    if (el) openPopoverFrom(el);
  });
  document.addEventListener("keydown", (e) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;
    const el = target.closest<HTMLElement>(".seal-logo");
    if (!el) return;
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openPopoverFrom(el); }
  });
}

// --- Init bei DOM-Ready ---
document.addEventListener("DOMContentLoaded", () => {
    // initMap();
    initScrollAnimations();
    initFlipCards();
    initNav();
    initSealsPopover();
});
