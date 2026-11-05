/**
 * Premium layer: cinematic intro, hero letter reveal, gold constellation,
 * 3D photo tilt, cursor halo + magnetic buttons, card spotlights, section
 * title reveals, scroll-drawn resume timeline, film grain and a ⌘K command
 * palette. Vanilla JS, no dependencies. Honors prefers-reduced-motion and
 * only enables pointer effects on devices with a fine pointer.
 */
(() => {
  "use strict";

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(pointer: fine)").matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const EMAIL = "patricio.monpelat@gmail.com";

  /* ---------------------------------------------------------------- *
   * Shared rAF-throttled scroll/resize bus
   * ---------------------------------------------------------------- */
  const onScroll = [];
  let scrollQueued = false;
  const flushScroll = () => { scrollQueued = false; onScroll.forEach((fn) => fn()); };
  const queueScroll = () => { if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(flushScroll); } };
  window.addEventListener("scroll", queueScroll, { passive: true });
  window.addEventListener("resize", queueScroll);
  window.addEventListener("load", queueScroll);

  /* ---------------------------------------------------------------- *
   * 1. Cinematic intro
   * ---------------------------------------------------------------- */
  function intro() {
    const ready = () => document.body.classList.add("is-ready");
    const pre = $("#preloader.intro");
    if (!pre) { ready(); return; }

    let seen = false;
    try {
      seen = sessionStorage.getItem("pm-intro") === "1";
      sessionStorage.setItem("pm-intro", "1");
    } catch (_) { /* storage blocked */ }
    const quick = reduce || seen;
    if (quick) pre.classList.add("intro-quick");

    const t0 = performance.now();
    const minTime = quick ? 0 : 1600;
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      const wait = Math.max(0, minTime - (performance.now() - t0));
      setTimeout(() => {
        pre.classList.add("intro-out");
        ready();
        setTimeout(() => pre.remove(), quick ? 250 : 950);
      }, wait);
    };
    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish, { once: true });
    setTimeout(finish, 5000); // never hold the page hostage
  }

  /* ---------------------------------------------------------------- *
   * 2. Hero name: per-letter masked rise
   * ---------------------------------------------------------------- */
  function splitHeroName() {
    const h1 = $(".hero .hero-text h1");
    if (!h1 || h1.classList.contains("hx-split")) return;
    h1.setAttribute("aria-label", h1.textContent.replace(/\s+/g, " ").trim());
    let i = 0;
    const walk = (node) => {
      Array.from(node.childNodes).forEach((n) => {
        if (n.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
            const word = document.createElement("span");
            word.className = "hx-word";
            word.setAttribute("aria-hidden", "true");
            for (const ch of part) {
              const c = document.createElement("span");
              c.className = "hx-char";
              c.textContent = ch;
              c.style.setProperty("--i", i++);
              word.appendChild(c);
            }
            frag.appendChild(word);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === Node.ELEMENT_NODE) {
          walk(n);
        }
      });
    };
    walk(h1);
    h1.classList.add("hx-split");
  }

  /* ---------------------------------------------------------------- *
   * 3. Hero gold constellation (canvas)
   * ---------------------------------------------------------------- */
  function constellation() {
    const hero = $(".hero");
    const host = $(".hero .background-elements");
    if (!hero || !host) return;
    const cv = document.createElement("canvas");
    cv.className = "hero-constellation";
    cv.setAttribute("aria-hidden", "true");
    host.appendChild(cv);
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0, pts = [], raf = 0, visible = true;
    const mouse = { x: 0, y: 0, active: false };
    const LINK = 115, LINK2 = LINK * LINK, REACH = 170;

    function resize() {
      const r = host.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = r.width; H = r.height;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.max(24, Math.min(90, Math.round((W * H) / 15000)));
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.5) * 0.2,
        r: Math.random() * 1.2 + 0.4, ph: Math.random() * Math.PI * 2,
      }));
      if (reduce) draw(0);
    }

    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      if (!reduce) {
        for (const p of pts) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > W) p.vx *= -1;
          if (p.y < 0 || p.y > H) p.vy *= -1;
          if (mouse.active) {
            const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
            if (d < REACH && d > 0.1) { const f = (1 - d / REACH) * 0.55; p.x += (dx / d) * f; p.y += (dy / d) * f; }
          }
        }
      }
      ctx.lineWidth = 0.6;
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j], dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
          if (d2 < LINK2) {
            ctx.strokeStyle = `rgba(200,164,92,${((1 - d2 / LINK2) * 0.16).toFixed(3)})`;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        if (mouse.active) {
          const d = Math.hypot(a.x - mouse.x, a.y - mouse.y);
          if (d < REACH) {
            ctx.strokeStyle = `rgba(243,214,138,${((1 - d / REACH) * 0.38).toFixed(3)})`;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
          }
        }
      }
      for (const p of pts) {
        const tw = 0.55 + 0.45 * Math.sin(t / 900 + p.ph);
        ctx.fillStyle = `rgba(243,214,138,${(0.3 + 0.5 * tw).toFixed(3)})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
    }

    const loop = (t) => { raf = requestAnimationFrame(loop); draw(t); };
    const start = () => { if (!raf && !reduce && visible && !document.hidden) raf = requestAnimationFrame(loop); };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };

    if (fine) {
      hero.addEventListener("pointermove", (e) => {
        const r = host.getBoundingClientRect();
        mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.active = true;
      }, { passive: true });
      hero.addEventListener("pointerleave", () => { mouse.active = false; });
    }
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? start() : stop(); }).observe(hero);
    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
    new ResizeObserver(resize).observe(host);
    resize();
    start();
  }

  /* ---------------------------------------------------------------- *
   * 4. Hero photo: rotating gold ring, 3D tilt, glare
   * ---------------------------------------------------------------- */
  function heroPhoto() {
    const box = $(".hero .profile-container");
    if (!box) return;
    box.classList.add("has-ring");
    if (reduce || !fine) return;

    box.classList.add("has-tilt");
    const glare = document.createElement("span");
    glare.className = "hero-glare";
    glare.setAttribute("aria-hidden", "true");
    box.appendChild(glare);

    const area = box.closest(".hero-visual") || box;
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    const step = () => {
      cx += (tx - cx) * 0.12; cy += (ty - cy) * 0.12;
      box.style.transform = `perspective(1000px) rotateY(${cx.toFixed(2)}deg) rotateX(${cy.toFixed(2)}deg)`;
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.02 ? requestAnimationFrame(step) : 0;
    };
    area.addEventListener("pointermove", (e) => {
      const r = box.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      tx = (px - 0.5) * 14; ty = (py - 0.5) * -14;
      box.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
      box.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
      box.classList.add("is-tilting");
      if (!raf) raf = requestAnimationFrame(step);
    });
    area.addEventListener("pointerleave", () => {
      tx = 0; ty = 0;
      box.classList.remove("is-tilting");
      if (!raf) raf = requestAnimationFrame(step);
    });
  }

  /* ---------------------------------------------------------------- *
   * 5. Cursor halo + magnetic buttons
   * ---------------------------------------------------------------- */
  function cursorHalo() {
    if (!fine || reduce) return;
    const ring = document.createElement("div");
    ring.className = "cursor-ring";
    ring.setAttribute("aria-hidden", "true");
    document.body.appendChild(ring);

    let x = -100, y = -100, rx = x, ry = y, raf = 0, shown = false;
    const step = () => {
      rx += (x - rx) * 0.22; ry += (y - ry) * 0.22;
      ring.style.transform = `translate3d(${rx.toFixed(1)}px, ${ry.toFixed(1)}px, 0) translate(-50%, -50%)`;
      raf = Math.abs(x - rx) + Math.abs(y - ry) > 0.2 ? requestAnimationFrame(step) : 0;
    };
    const INTERACTIVE = "a, button, [role='button'], .btn, label, summary, [data-cmdk], .dnb-dino";
    window.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX; y = e.clientY;
      if (!shown) { shown = true; rx = x; ry = y; ring.classList.add("is-on"); }
      const t = e.target instanceof Element ? e.target : null;
      const field = t && t.closest("input, textarea, select");
      ring.classList.toggle("is-text", !!field);
      ring.classList.toggle("is-link", !field && !!(t && t.closest(INTERACTIVE)));
      if (!raf) raf = requestAnimationFrame(step);
    }, { passive: true });
    document.addEventListener("mouseout", (e) => {
      if (!e.relatedTarget) { shown = false; ring.classList.remove("is-on"); }
    });
    window.addEventListener("pointerdown", () => ring.classList.add("is-down"));
    window.addEventListener("pointerup", () => ring.classList.remove("is-down"));
  }

  function magnetic() {
    if (!fine || reduce) return;
    $$(".btn, .hero .social-links a, .sidebar-cta").forEach((el) => {
      el.classList.add("is-magnetic");
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${(dx * 0.18).toFixed(1)}px, ${(dy * 0.3).toFixed(1)}px)`;
      });
      el.addEventListener("pointerleave", () => { el.style.transform = ""; });
    });
  }

  /* ---------------------------------------------------------------- *
   * 6. Card spotlights (glow + border light that follow the pointer)
   * ---------------------------------------------------------------- */
  function spotlights() {
    if (!fine) return;
    $$(".about .profile-card, .resume .resume-side, .contact .contact-form, .contact .info-box, .header .sidebar-card")
      .forEach((card) => {
        card.classList.add("has-spotlight");
        const s = document.createElement("span");
        s.className = "spotlight";
        s.setAttribute("aria-hidden", "true");
        card.prepend(s);
        card.addEventListener("pointermove", (e) => {
          const r = card.getBoundingClientRect();
          card.style.setProperty("--mx", `${(e.clientX - r.left).toFixed(0)}px`);
          card.style.setProperty("--my", `${(e.clientY - r.top).toFixed(0)}px`);
        });
      });
  }

  /* ---------------------------------------------------------------- *
   * 7. Section title reveals
   * ---------------------------------------------------------------- */
  function titleReveals() {
    if (reduce) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("is-inview"); io.unobserve(e.target); }
      });
    }, { threshold: 0.35 });
    $$(".section-title").forEach((st) => {
      const h2 = $("h2", st);
      if (h2 && !$(".st-inner", h2)) {
        const inner = document.createElement("span");
        inner.className = "st-inner";
        while (h2.firstChild) inner.appendChild(h2.firstChild);
        const mask = document.createElement("span");
        mask.className = "st-mask";
        mask.appendChild(inner);
        h2.appendChild(mask);
      }
      st.classList.add("reveal-ready");
      io.observe(st);
    });
  }

  /* ---------------------------------------------------------------- *
   * 8. Resume timeline drawn by scroll
   * ---------------------------------------------------------------- */
  function timeline() {
    $$(".resume .resume-section").forEach((sec) => {
      const items = $$(".resume-item", sec);
      if (!items.length) return;
      sec.classList.add("tl-ready");
      const fill = document.createElement("span");
      fill.className = "tl-fill";
      fill.setAttribute("aria-hidden", "true");
      sec.appendChild(fill);

      const update = () => {
        const first = items[0], last = items[items.length - 1];
        const top = first.offsetTop;
        const total = last.offsetTop + last.offsetHeight - top;
        const lineY = window.innerHeight * 0.62;
        const r = sec.getBoundingClientRect();
        const prog = reduce ? total : Math.min(total, Math.max(0, lineY - (r.top + top)));
        fill.style.top = `${top}px`;
        fill.style.height = `${prog}px`;
        items.forEach((it) => it.classList.toggle("is-lit", it.offsetTop - top <= prog));
      };
      onScroll.push(update);
      update();
    });
  }

  /* ---------------------------------------------------------------- *
   * 9. Film grain
   * ---------------------------------------------------------------- */
  function grain() {
    const g = document.createElement("div");
    g.className = "film-grain";
    g.setAttribute("aria-hidden", "true");
    document.body.appendChild(g);
  }

  /* ---------------------------------------------------------------- *
   * 10. Toasts
   * ---------------------------------------------------------------- */
  let toastTimer = 0;
  function toast(msg) {
    let t = $(".pm-toast");
    if (!t) {
      t = document.createElement("div");
      t.className = "pm-toast";
      t.setAttribute("role", "status");
      t.setAttribute("aria-live", "polite");
      document.body.appendChild(t);
    }
    t.innerHTML = `<i class="bi bi-check2-circle" aria-hidden="true"></i><span></span>`;
    t.querySelector("span").textContent = msg;
    t.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("is-on"), 2200);
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (_) {
      const ta = document.createElement("textarea");
      ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch (__) { /* ignore */ }
      ta.remove();
    }
    toast("Email copied to clipboard");
  }

  /* ---------------------------------------------------------------- *
   * 11. Command palette (Ctrl/⌘ + K)
   * ---------------------------------------------------------------- */
  function palette() {
    const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
    $$(".kbd-mod").forEach((k) => { k.textContent = isMac ? "⌘" : "Ctrl"; });

    const go = (hash) => {
      const el = $(hash);
      if (el) el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    };
    const openUrl = (url) => window.open(url, "_blank", "noopener,noreferrer");
    const COMMANDS = [
      { group: "Navigate", icon: "bi-house", label: "Home", hint: "01", run: () => go("#hero") },
      { group: "Navigate", icon: "bi-person", label: "About", hint: "02", run: () => go("#about") },
      { group: "Navigate", icon: "bi-diagram-3", label: "Skills", run: () => go("#skills") },
      { group: "Navigate", icon: "bi-file-earmark-text", label: "Resume", hint: "03", run: () => go("#resume") },
      { group: "Navigate", icon: "bi-envelope", label: "Contact", hint: "04", run: () => go("#contact") },
      {
        group: "Actions", icon: "bi-download", label: "Download CV",
        run: () => { const a = document.createElement("a"); a.href = "resume.pdf"; a.download = ""; document.body.appendChild(a); a.click(); a.remove(); },
      },
      { group: "Actions", icon: "bi-clipboard", label: "Copy email address", run: () => copyText(EMAIL) },
      { group: "Actions", icon: "bi-send", label: "Write me an email", run: () => { window.location.href = `mailto:${EMAIL}`; } },
      {
        group: "Actions", icon: "bi-stars", label: "Say hi to the dino 🦖",
        run: () => { go("#about"); setTimeout(() => window.dispatchEvent(new CustomEvent("dino:hello")), reduce ? 50 : 900); },
      },
      { group: "Links", icon: "bi-linkedin", label: "LinkedIn", hint: "↗", run: () => openUrl("https://www.linkedin.com/in/patricio-monpelat") },
      { group: "Links", icon: "bi-github", label: "GitHub", hint: "↗", run: () => openUrl("https://github.com/PatricioMonpelat") },
    ];

    const root = document.createElement("div");
    root.className = "cmdk";
    root.hidden = true;
    root.innerHTML = `
      <div class="cmdk-backdrop" data-close></div>
      <div class="cmdk-panel" role="dialog" aria-modal="true" aria-label="Command menu">
        <div class="cmdk-search">
          <i class="bi bi-search" aria-hidden="true"></i>
          <input type="text" placeholder="Type a command or search…" autocomplete="off" spellcheck="false"
                 role="combobox" aria-expanded="true" aria-controls="cmdk-list" aria-label="Search commands" />
          <kbd>esc</kbd>
        </div>
        <ul class="cmdk-list" id="cmdk-list" role="listbox"></ul>
        <div class="cmdk-foot">
          <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
          <span><kbd>↵</kbd> select</span>
          <span class="cmdk-brand">PM</span>
        </div>
      </div>`;
    document.body.appendChild(root);

    const input = $("input", root);
    const list = $(".cmdk-list", root);
    let filtered = COMMANDS, active = 0, lastFocus = null, closeTimer = 0;

    const fuzzy = (q, text) => {
      q = q.toLowerCase(); text = text.toLowerCase();
      if (text.includes(q)) return true;
      let i = 0;
      for (const ch of text) if (ch === q[i]) i++;
      return i === q.length;
    };

    function render() {
      const q = input.value.trim();
      filtered = q ? COMMANDS.filter((c) => fuzzy(q, c.label)) : COMMANDS;
      active = Math.min(active, Math.max(0, filtered.length - 1));
      list.innerHTML = "";
      if (!filtered.length) {
        list.innerHTML = `<li class="cmdk-empty">No results for “<span></span>”</li>`;
        list.querySelector("span").textContent = q;
        input.removeAttribute("aria-activedescendant");
        return;
      }
      let group = "";
      filtered.forEach((c, i) => {
        if (c.group !== group) {
          group = c.group;
          const h = document.createElement("li");
          h.className = "cmdk-group";
          h.setAttribute("role", "presentation");
          h.textContent = group;
          list.appendChild(h);
        }
        const li = document.createElement("li");
        li.className = "cmdk-item";
        li.id = `cmdk-opt-${i}`;
        li.setAttribute("role", "option");
        li.setAttribute("aria-selected", String(i === active));
        li.innerHTML = `<span class="cmdk-icon"><i class="bi ${c.icon}" aria-hidden="true"></i></span><span class="cmdk-label"></span>${c.hint ? `<span class="cmdk-hint">${c.hint}</span>` : ""}`;
        li.querySelector(".cmdk-label").textContent = c.label;
        li.addEventListener("mousemove", () => { if (active !== i) { active = i; paint(); } });
        li.addEventListener("click", () => exec(i));
        list.appendChild(li);
      });
      paint();
    }

    function paint() {
      $$(".cmdk-item", list).forEach((li, i) => li.setAttribute("aria-selected", String(i === active)));
      const cur = $(`#cmdk-opt-${active}`, list);
      if (cur) { input.setAttribute("aria-activedescendant", cur.id); cur.scrollIntoView({ block: "nearest" }); }
    }

    function exec(i) {
      const c = filtered[i];
      if (!c) return;
      close();
      setTimeout(() => c.run(), 120);
    }

    function open() {
      clearTimeout(closeTimer);
      lastFocus = document.activeElement;
      root.hidden = false;
      input.value = ""; active = 0;
      render();
      requestAnimationFrame(() => root.classList.add("is-open"));
      setTimeout(() => input.focus(), 20);
      document.documentElement.classList.add("cmdk-lock");
    }

    function close() {
      root.classList.remove("is-open");
      document.documentElement.classList.remove("cmdk-lock");
      closeTimer = setTimeout(() => { root.hidden = true; }, reduce ? 0 : 220);
      if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    }

    input.addEventListener("input", () => { active = 0; render(); });
    root.addEventListener("click", (e) => { if (e.target.hasAttribute("data-close")) close(); });
    root.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); active = (active + 1) % Math.max(1, filtered.length); paint(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); active = (active - 1 + filtered.length) % Math.max(1, filtered.length); paint(); }
      else if (e.key === "Enter") { e.preventDefault(); exec(active); }
      else if (e.key === "Escape") { e.preventDefault(); close(); }
      else if (e.key === "Tab") { e.preventDefault(); input.focus(); }
    });

    document.addEventListener("keydown", (e) => {
      const typing = e.target instanceof Element && e.target.closest("input, textarea, select, [contenteditable='true']");
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        root.hidden ? open() : close();
      } else if (e.key === "/" && !typing && root.hidden) {
        e.preventDefault();
        open();
      }
    });
    $$("[data-cmdk]").forEach((b) => b.addEventListener("click", open));
  }

  /* ---------------------------------------------------------------- *
   * Boot
   * ---------------------------------------------------------------- */
  const safe = (fn) => { try { fn(); } catch (err) { console.error(err); } };
  // Whatever happens, never leave the hero name hidden.
  setTimeout(() => document.body.classList.add("is-ready"), 6000);
  safe(splitHeroName);
  safe(intro);
  safe(constellation);
  safe(heroPhoto);
  safe(cursorHalo);
  safe(magnetic);
  safe(spotlights);
  safe(titleReveals);
  safe(timeline);
  safe(grain);
  safe(palette);
})();
