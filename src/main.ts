import "@fortawesome/fontawesome-free/css/all.min.css";
import "@fontsource-variable/open-sans";
import "./assets/styles/styles.css";
import sealsData from "./data/seals.json";

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

        function toggleFlip() {
            flip!.classList.toggle("flipped");
            sRound!.classList.add("s_round_click");
            sArrow!.classList.toggle("s_arrow_rotate");
            bRound!.classList.toggle("b_round_back_hover");
            const expanded = flip!.classList.contains("flipped");
            sRound!.setAttribute("aria-expanded", String(expanded));
        }

        sRound.addEventListener("mouseenter", () => {
            bRound.classList.add("b_round_hover");
        });
        sRound.addEventListener("mouseleave", () => {
            bRound.classList.remove("b_round_hover");
        });
        sRound.addEventListener("click", (e) => {
            e.preventDefault();
            toggleFlip();
        });
        sRound.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleFlip();
            }
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

const SEALS = sealsData as Record<string, SealMeta>;

function initSealsPopover(): void {
    const pop = document.getElementById("logo-popover") as (HTMLElement & PopoverApi) | null;
    if (!pop) return;

    // Alle Siegel-Logos per Tastatur erreichbar machen
    document.querySelectorAll<HTMLElement>(".seal-logo").forEach((el) => {
        el.setAttribute("tabindex", "0");
        el.setAttribute("role", "button");
        el.setAttribute("aria-haspopup", "dialog");
    });

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
    initScrollAnimations();
    initFlipCards();
    initNav();
    initSealsPopover();
});
