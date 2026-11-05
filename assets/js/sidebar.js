/**
 * Sidebar enhancements: live Buenos Aires clock, sliding active-section
 * indicator (follows hover, returns to the active link), scroll progress.
 */
(() => {
  "use strict";

  const card = document.querySelector(".header .sidebar-card");
  if (!card) return;

  /* Live clock */
  const clock = card.querySelector(".sidebar-clock");
  if (clock) {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/Argentina/Buenos_Aires",
    });
    const tick = () => {
      const now = new Date();
      clock.textContent = fmt.format(now);
      clock.setAttribute("datetime", now.toISOString());
    };
    tick();
    setInterval(tick, 15000);
  }

  /* Sliding indicator */
  const nav = card.querySelector(".navmenu");
  const indicator = card.querySelector(".nav-indicator");
  const links = nav ? Array.from(nav.querySelectorAll("a")) : [];
  let hovered = null;

  function moveTo(link) {
    if (!indicator) return;
    if (!link) { indicator.style.setProperty("--ind-o", 0); return; }
    indicator.style.setProperty("--ind-y", `${link.offsetTop}px`);
    indicator.style.setProperty("--ind-h", `${link.offsetHeight}px`);
    indicator.style.setProperty("--ind-o", 1);
  }
  const active = () => nav.querySelector("a.active");
  const update = () => moveTo(hovered || active());

  if (nav && indicator) {
    links.forEach((a) => {
      a.addEventListener("mouseenter", () => { hovered = a; update(); });
      a.addEventListener("focus", () => { hovered = a; update(); });
      a.addEventListener("blur", () => { hovered = null; update(); });
    });
    nav.addEventListener("mouseleave", () => { hovered = null; update(); });

    // main.js scrollspy toggles .active; follow it.
    new MutationObserver(update).observe(nav, {
      subtree: true,
      attributes: true,
      attributeFilter: ["class"],
    });
    window.addEventListener("resize", update);
    window.addEventListener("load", update);
    update();
  }

  /* Scroll progress */
  let ticking = false;
  function progress() {
    ticking = false;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    card.style.setProperty("--progress", p.toFixed(4));
  }
  document.addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(progress); }
  }, { passive: true });
  progress();
})();
