const btnEl = document.getElementById("nav-toggle-btn") as HTMLButtonElement | null;
const menuEl = document.getElementById("primary-menu") as HTMLElement | null;

if (btnEl && menuEl) {
  const btn = btnEl;
  const menu = menuEl;

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
