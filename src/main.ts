import "leaflet/dist/leaflet.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import L from "leaflet";
import "./assets/styles/styles.css";

function initMap(): void {
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

    L.tileLayer("https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png", {
        maxZoom: 19,
        detectRetina: true,
        updateWhenIdle: true,
        keepBuffer: 1,
        crossOrigin: true,
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    L.marker([lat, lng]).addTo(map).bindPopup("<img src='/img/logo_pmi_web.svg' alt='Projekt M Immobilien GmbH – Logo' style='width:120px' />", { closeButton: false, maxWidth: 500, autoPan: true }).openPopup();

    map.whenReady(() => map.invalidateSize());
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
    initMap();
    initFlipCards();
    initNav();
});
