import { getCertification, type CertificationMeta } from "../data/certifications";

type PopoverApi = {
  showPopover?: () => void;
  hidePopover?: () => void;
};

document.addEventListener("astro:page-load", () => {
  const pop = document.getElementById("logo-popover") as (HTMLElement & PopoverApi) | null;
  if (pop) {
    // Alle Siegel-Logos per Tastatur erreichbar machen
    document.querySelectorAll<HTMLElement>(".seal-logo").forEach((el) => {
      el.setAttribute("tabindex", "0");
      el.setAttribute("role", "button");
      el.setAttribute("aria-haspopup", "dialog");
      const key = el.dataset.certification || el.dataset.seal || "";
      const meta = getCertification(key);
      const label = el.getAttribute("data-title") || meta?.title || el.getAttribute("alt") || "Siegel";
      el.setAttribute("aria-label", `${label} anzeigen`);
    });

    const imgEl = document.getElementById("lp-img") as HTMLImageElement | null;
    const titleEl = document.getElementById("lp-title") as HTMLElement | null;
    const descEl = document.getElementById("lp-desc") as HTMLElement | null;
    const holderEl = document.getElementById("lp-certificateHolder") as HTMLElement | null;
    const linkWrap = document.getElementById("lp-link-wrap") as HTMLElement | null;
    const linkEl = document.getElementById("lp-link") as HTMLAnchorElement | null;

    function openPopoverFrom(el: HTMLElement): void {
      if (!pop || !imgEl || !titleEl || !descEl || !linkWrap || !linkEl) return;
      const key = el.dataset.certification || el.dataset.seal || "";
      const meta = getCertification(key) || ({} as CertificationMeta);
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
});
