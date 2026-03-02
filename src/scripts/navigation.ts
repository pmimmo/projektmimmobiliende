const btnEl = document.getElementById("nav-toggle-btn") as HTMLButtonElement | null;
const menuEl = document.getElementById("primary-menu") as HTMLElement | null;

if (btnEl && menuEl) {
  const btn = btnEl;
  const menu = menuEl;

  const focusableSelector = 'a[href], button:not([disabled])';

  function setExpanded(expanded: boolean) {
    btn.setAttribute("aria-expanded", String(expanded));
    if (expanded) {
      menu.classList.add("open");
      // Fokus auf ersten Link im Menü setzen
      const firstItem = menu.querySelector<HTMLElement>(focusableSelector);
      firstItem?.focus();
    } else {
      menu.classList.remove("open");
      btn.focus();
    }
  }

  btn.addEventListener("click", () => {
    const isOpen = btn.getAttribute("aria-expanded") === "true";
    setExpanded(!isOpen);
  });

  // ESC + Focus Trap
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (btn.getAttribute("aria-expanded") === "true") setExpanded(false);
      return;
    }

    // Focus Trap: nur aktiv wenn Menü offen
    if (e.key !== "Tab" || btn.getAttribute("aria-expanded") !== "true") return;

    const focusable = [btn, ...Array.from(menu.querySelectorAll<HTMLElement>(focusableSelector))];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last?.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first?.focus();
    }
  });

  // Klick außerhalb schließt Menü
  document.addEventListener("click", (e) => {
    if (btn.getAttribute("aria-expanded") === "true" && !menu.contains(e.target as Node) && e.target !== btn && !btn.contains(e.target as Node)) {
      setExpanded(false);
    }
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
