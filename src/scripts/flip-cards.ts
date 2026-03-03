document.addEventListener("astro:page-load", () => {
  document.querySelectorAll(".kacheln .flip_container").forEach((card) => {
    const flip = card.querySelector<HTMLElement>(".flip_box");
    const rWraps = card.querySelectorAll<HTMLElement>(".r_wrap");
    if (!flip || !rWraps.length) return;

    function toggleFlip() {
      flip!.classList.toggle("flipped");
      const expanded = flip!.classList.contains("flipped");
      rWraps.forEach((rw) =>
        rw.setAttribute("aria-expanded", String(expanded)),
      );
    }

    rWraps.forEach((rWrap) => {
      rWrap.addEventListener("click", (e) => {
        e.preventDefault();
        toggleFlip();
      });
      rWrap.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleFlip();
        }
      });
    });
  });
});
