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

// --- Init bei DOM-Ready ---
document.addEventListener("DOMContentLoaded", () => {
    // initMap();
    initScrollAnimations();
    initFlipCards();
    initNav();
});
