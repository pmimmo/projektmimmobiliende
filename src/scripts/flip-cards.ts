document.addEventListener("astro:page-load", () => {
  document.querySelectorAll(".kacheln .flip_container").forEach((card) => {
    const rWrap = card.querySelector<HTMLElement>(".r_wrap");
    const sRound = card.querySelector<HTMLElement>(".s_round");
    const bRound = card.querySelector<HTMLElement>(".b_round");
    const flip = card.querySelector<HTMLElement>(".flip_box");
    const sArrow = card.querySelector<HTMLElement>(".s_arrow");
    if (!rWrap || !sRound || !bRound || !flip || !sArrow) return;

    function toggleFlip() {
      flip!.classList.toggle("flipped");
      sRound!.classList.add("s_round_click");
      sArrow!.classList.toggle("s_arrow_rotate");
      bRound!.classList.toggle("b_round_back_hover");
      const expanded = flip!.classList.contains("flipped");
      rWrap!.setAttribute("aria-expanded", String(expanded));
    }

    rWrap.addEventListener("mouseenter", () => {
      bRound.classList.add("b_round_hover");
    });
    rWrap.addEventListener("mouseleave", () => {
      bRound.classList.remove("b_round_hover");
    });
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
    sRound.addEventListener("transitionend", () => {
      sRound.classList.remove("s_round_click");
      sRound.classList.add("s_round_back");
    });
  });
});
