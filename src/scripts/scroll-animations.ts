const animatedSel = ".fade-in, .slide-in-left, .slide-in-right, .scale-up, .flip_container";

// 1) Observer für Einzel-Elemente außerhalb von Stagger-Containern
const outsideStagger = Array.from(
  document.querySelectorAll<HTMLElement>(animatedSel)
).filter((el) => !el.closest("[data-stagger]"));

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

document
  .querySelectorAll<HTMLElement>("[data-stagger]")
  .forEach((c) => ioStagger.observe(c));
