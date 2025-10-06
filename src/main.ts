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
        desc: "DIN EN 15733 ist die europaweit gültige Norm für Immobilienmakler. Sie bestätigt Mindestqualifikation, regelt Informationspflichten und verpflichtet zu einem Moralkodex inklusive Versicherung und Beschwerdemanagement. Die Zertifizierung erfolgt auf freiwilliger Basis.",
        link: "",
    },

    "dekra-d1": {
        title: "DEKRA Sachverständige/r Immobilienbewertung D1",
        desc: "Das D1-Zertifikat bestätigt besondere Fachkompetenz bei der Bewertung von Standard-Ein- und Zweifamilienhäusern. Geprüfte Sachverständige verfügen über fundiertes Fachwissen, rechtliche Kenntnisse und praktische Erfahrung in der Wertermittlung. Sie müssen ihr Wissen regelmäßig durch Fortbildungen und Rezertifizierungen nachweisen. Das Siegel steht für transparente und nachvollziehbare Markt- und Verkehrswertermittlungen.",
        holder: "Rüdiger Neuer",
        link: "",
    },

    "sprengnetter-immowert": {
        title: "SPRENGNETTER Gesicherter ImmoWert",
        desc: "Dieses Qualitätssiegel bestätigt, dass die Wertermittlung auf standardisierten, geprüften Verfahren und aktueller Marktkenntnis basiert. Nur Sachverständige mit nachgewiesener Fachkompetenz und regelmäßiger Weiterbildung dürfen es verwenden.",
        link: "",
    },

    "sprengnetter-immomediator": {
        title: "SPRENGNETTER ImmoMediator",
        desc: "Dieses Siegel steht für geprüfte Kompetenz in Mediation und Konfliktlösung im Immobilienbereich. Zertifizierte Mediatoren unterstützen bei Streitigkeiten – z. B. bei Erbschaft, Scheidung oder Bauprojekten – außergerichtlich, neutral und fair.",
        link: "",
    },

    "sprengnetter-immobesichtiger": {
        title: "SPRENGNETTER ImmoBesichtiger – Schadenerkennung",
        desc: "Dieses Siegel bescheinigt die Qualifikation, bei Objektbesichtigungen Bau- und Instandhaltungsmängel zuverlässig zu erkennen und korrekt zu dokumentieren. Es trägt dazu bei, Folgekosten durch unerkannte Schäden zu vermeiden.",
        link: "",
    },

    "dia-absolvent": {
        title: "Absolvent/in der Deutschen Immobilien-Akademie (DIA)",
        desc: "Die Deutsche Immobilien-Akademie (DIA) ist eine der führenden Bildungseinrichtungen in der Immobilienwirtschaft. Absolvent:innen verfügen über vertiefte Kenntnisse in Immobilienbewertung, Baurecht, Marktanalyse und Bewertungstechniken. Der DIA-Abschluss bildet eine solide Grundlage für qualifizierte Gutachter- und Beratertätigkeiten.",
        link: "",
    },

    "dia-zert-s": {
        title: "Zertifizierter Immobiliengutachter S (DIAZert)",
        desc: "Zertifizierter Gutachter für Markt- und Beleihungswertermittlung von Standardimmobilien (S) gemäß ImmoWertV und BelWertV. Die Zertifizierung erfolgt nach den normativen Vorgaben der DIA Consulting AG unter Einhaltung der Anforderungen der DIN EN ISO/IEC 17024.",
        holder: "Rüdiger Neuer",
        link: "https://www.diaconsulting.de/de/140/?credential=f2930293-be2a-4652-8850-f588d017f5fb",
    },

    "dia-zert-din15733": {
        title: "DIA Zert – Zertifiziert nach EU-Norm DIN EN 15733",
        desc: "Das DIA-Zertifikat nach DIN EN 15733 bestätigt die Einhaltung europäischer Qualitätsstandards für Immobilienmakler. Es steht für geprüfte Fachkunde, Transparenz, Ethik und ein dokumentiertes Beschwerdemanagementsystem. Damit erhalten Kund:innen ein verbindliches Qualitätskennzeichen.",
        link: "",
    },

    "dia-zert-dipl-sach": {
        title: "Diplom-Sachverständige/r (DIA)",
        desc: "Der Titel „Diplom-Sachverständige/r (DIA)“ steht für umfassende Fachkompetenz in der Bewertung bebauter und unbebauter Grundstücke sowie der Bewertung von Mieten und Pachten. Der Abschluss ist in der Branche anerkannt und dient als Grundlage für Zertifizierungen und öffentliche Bestellung.",
        holder: "Rüdiger Neuer",
        link: "https://www.dia.de/de/657/?credential=6b8e7a13-3e59-4930-a8ee-e2c27078db58",
    },

    "hypzert-s": {
        title: "HypZert S – Real Estate Valuer for Standard Properties",
        desc: "Das HypZert S-Zertifikat bestätigt Qualifikation für Markt- und Beleihungswertermittlungen standardisierter Wohnimmobilien – insbesondere Ein- und Mehrfamilienhäuser. Die Zertifizierung orientiert sich an internationalen Standards und fordert regelmäßige Rezertifizierung.",
        link: "",
    },

    "hypzert-gutachter": {
        title: "Wir beschäftigen HypZert-zertifizierte Gutachter:innen",
        desc: "HypZert ist eine führende Zertifizierungsstelle für Immobiliengutachter:innen in der Finanzwirtschaft. HypZert-Zertifikate stehen für strenge Prüfungsanforderungen, hohe Fachkompetenz und regelmäßige Überprüfung nach DIN EN ISO/IEC 17024.",
        link: "",
    },

    ivd: {
        title: "Mitglied im IVD",
        desc: "Mitglieder im Immobilienverband Deutschland (IVD) verpflichten sich zu Berufs- und Wettbewerbsregeln, fortlaufender Weiterbildung und transparenter Kundenkommunikation. Der Verband vernetzt qualifizierte Makler:innen, Gutachter:innen und Verwalter:innen und fördert Qualität in der Immobilienwirtschaft.",
        link: "",
    },

    "ivd-weiterbildung": {
        title: "IVD-Immobilien-Weiterbildungssiegel",
        desc: "Das Siegel bestätigt kontinuierliche Qualifizierung durch mindestens 15 Stunden anerkannte Fortbildung pro Jahr. Es signalisiert Fachwissen, rechtliche Sicherheit und dass Kund:innen durch geprüfte Kompetenz begleitet werden.",
    },

    "ivd-marktforschung": {
        title: "Partner der IVD-Marktforschung",
        desc: "Dieses Siegel kennzeichnet Unternehmen, die aktiv an Datenerhebung und Marktanalyse im Immobiliensektor mitwirken. Dadurch unterstützen sie belastbare Marktberichte und profitieren selbst frühzeitig von fundierten Informationen.",
    },

    vdiv: {
        title: "Mitglied im vdiv – Verband der Immobilienverwalter Bayern",
        desc: "Der vdiv Bayern ist Teil eines bundesweiten Netzwerks professioneller Haus- und Immobilienverwalter:innen. Mitglieder verpflichten sich zu Qualitätsstandards, Fachinformation und Fortbildung. Der Verband schützt Interessen von Eigentümer:innen und Verwalter:innen gleichermaßen.",
        link: "",
    },

    "immoscout24-silber": {
        title: "ImmoScout24 Silber Partner seit 2025",
        desc: "Das Silber-Siegel von ImmoScout24 wird an Partnerunternehmen verliehen, die durch hohe Aktivität, gute Bewertungen und professionelle Objektpräsentation überzeugen. Es steht für Erfahrung, Verlässlichkeit und erhöhte Sichtbarkeit.",
        link: "",
    },

    "immowelt-premium": {
        title: "immowelt Premium Partner",
        desc: "Das Premium-Siegel von Immowelt kennzeichnet Makler:innen und Immobilienunternehmen mit hoher Servicequalität, starker Präsenz auf der Plattform und positiven Kundenbewertungen. Es signalisiert Professionalität und gute Marktreichweite.",
        link: "",
    },

    "haus+grund": {
        title: "HAUS+GRUND MÜNCHEN – Haus- und Grundbesitzerverein München und Umgebung e. V.",
        desc: "HAUS+GRUND München ist seit 1879 die unabhängige Interessenvertretung für Eigentümer:innen von Häusern, Wohnungen und Grundstücken. Der Verein bietet rechtliche Beratung, praktische Informationen und politische Vertretung rund um Vermietung und Verwaltung.",
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
        const meta = key && SEALS[key] ? SEALS[key] : ({} as SealMeta);
        const title = el.getAttribute("data-title") || meta.title || el.getAttribute("alt") || "Siegel";
        const desc = el.getAttribute("data-desc") || meta.desc || "";
        const holder = el.getAttribute("data-holder") || meta.holder || "";
        const href = el.getAttribute("data-link") || meta.link || "";

        const img = el as HTMLImageElement;
        imgEl.src = img.currentSrc || img.src || "";
        imgEl.alt = title;
        titleEl.textContent = title;
        descEl.textContent = desc;
        if (holderEl) {
            if (holder) {
                holderEl.textContent = "Ausgestellt für: " + holder;
                holderEl.hidden = false;
            } else {
                holderEl.hidden = true;
            }
        }
        if (href) {
            linkEl.href = href;
            linkWrap.hidden = false;
        } else {
            linkWrap.hidden = true;
            linkEl.removeAttribute("href");
        }

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
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openPopoverFrom(el);
        }
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
