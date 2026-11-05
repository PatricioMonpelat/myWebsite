/**
 * Dino Buddy — a tiny hand-drawn SVG dinosaur that lives inside the
 * About profile photo. It peeks out, jumps over the rim, performs one act
 * (they rotate: boop the badge, drink mate, backflip, type on a laptop),
 * then leaves and re-emerges from inside the circle. Loops forever.
 * Vanilla JS, no dependencies. Pauses off-screen; respects reduced motion.
 */
(() => {
  "use strict";

  const card = document.querySelector(".about .profile-card");
  if (!card) return;
  const header = card.querySelector(".profile-header");
  const photo = card.querySelector(".profile-image");
  const badge = card.querySelector(".profile-badge");
  if (!header || !photo) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------ *
   * Markup (dino faces right, feet at origin, ~62 units tall)
   * ------------------------------------------------------------------ */
  const OL = "#2c5f31"; // outline colour
  const stage = document.createElement("div");
  stage.className = "dino-stage";
  stage.setAttribute("aria-hidden", "true");
  stage.innerHTML = `
<svg class="dino-svg" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="dnb-skin" cx="38%" cy="26%" r="80%">
      <stop offset="0" stop-color="#c4f0a6"/>
      <stop offset=".5" stop-color="#82c96f"/>
      <stop offset="1" stop-color="#4f9a4f"/>
    </radialGradient>
    <linearGradient id="dnb-skin-dark" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#6fb664"/>
      <stop offset="1" stop-color="#438546"/>
    </linearGradient>
    <linearGradient id="dnb-belly" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff8e2"/>
      <stop offset="1" stop-color="#ecd49d"/>
    </linearGradient>
    <linearGradient id="dnb-spike" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fbdf96"/>
      <stop offset="1" stop-color="#d39a3f"/>
    </linearGradient>
    <radialGradient id="dnb-iris" cx="40%" cy="35%" r="70%">
      <stop offset="0" stop-color="#8a6236"/>
      <stop offset="1" stop-color="#2b1a0d"/>
    </radialGradient>
    <linearGradient id="dnb-gourd" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#a8703f"/>
      <stop offset="1" stop-color="#5a361b"/>
    </linearGradient>
    <radialGradient id="dnb-glow">
      <stop offset="0" stop-color="#fff6cf" stop-opacity="1"/>
      <stop offset=".3" stop-color="#f5cf6e" stop-opacity=".8"/>
      <stop offset="1" stop-color="#c8a45c" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="dnb-screenglow">
      <stop offset="0" stop-color="#a9dcff" stop-opacity=".55"/>
      <stop offset="1" stop-color="#a9dcff" stop-opacity="0"/>
    </radialGradient>
    <clipPath id="dnb-clip">
      <circle class="dnb-clip-circle"/>
      <rect class="dnb-clip-rect" x="-2000" y="-2000" width="6000"/>
    </clipPath>
  </defs>

  <g class="dnb-clipwrap">
    <ellipse class="dnb-shadow" rx="19" ry="3.8" fill="#000"/>
    <g class="dnb-dino">
      <g class="dnb-squash"><g class="dnb-spin"><g class="dnb-bob">

        <g class="dnb-tail">
          <path d="M-25.7,-21 L-28.9,-27.7 L-21,-24.8 Z M-30.5,-16.2 L-34.2,-21.7 L-26.9,-19.9 Z M-34.9,-10.9 L-38.4,-15.1 L-32.3,-14.2 Z"
                fill="url(#dnb-spike)" stroke="#b5822f" stroke-width="1.1" stroke-linejoin="round"/>
          <path d="M-8,-31 C-21,-29 -31,-19 -41,-4 C-31,-5.2 -20,-10 -9,-14 Z"
                fill="url(#dnb-skin)" stroke="${OL}" stroke-width="1.5" stroke-linejoin="round"/>
          <circle cx="-21" cy="-20" r="2.1" fill="#3f8a43" opacity=".45"/>
          <circle cx="-28.5" cy="-13" r="1.5" fill="#3f8a43" opacity=".45"/>
        </g>

        <g class="dnb-arm-far">
          <path d="M7,-27.5 q6,.8 8.2,6" stroke="${OL}" stroke-width="5.6" fill="none" stroke-linecap="round"/>
          <path d="M7,-27.5 q6,.8 8.2,6" stroke="#3f8042" stroke-width="3.6" fill="none" stroke-linecap="round"/>
        </g>

        <g class="dnb-leg-far">
          <rect x="-9.5" y="-15" width="9" height="14.5" rx="4.5" fill="#3f8042" stroke="${OL}" stroke-width="1.3"/>
          <ellipse cx="-4" cy="-1.2" rx="6.2" ry="2.7" fill="#3f8042" stroke="${OL}" stroke-width="1.3"/>
        </g>

        <path d="M-2.4,-38.5 L-1.4,-45.8 L3.2,-39.4 Z M-8.6,-36 L-10.2,-43.4 L-3.2,-38.4 Z M-14.1,-31.2 L-18.4,-37.8 L-9.9,-35.4 Z M-17,-24.7 L-23.6,-28.6 L-15,-30.3 Z"
              fill="url(#dnb-spike)" stroke="#b5822f" stroke-width="1.4" stroke-linejoin="round"/>

        <ellipse cx="0" cy="-22" rx="17" ry="16" fill="url(#dnb-skin)" stroke="${OL}" stroke-width="1.6"/>
        <circle cx="-8" cy="-30" r="2.6" fill="#3f8a43" opacity=".4"/>
        <circle cx="-12.5" cy="-22" r="2" fill="#3f8a43" opacity=".4"/>
        <circle cx="-4" cy="-34.5" r="1.7" fill="#3f8a43" opacity=".4"/>
        <circle cx="-9" cy="-15" r="1.4" fill="#3f8a43" opacity=".4"/>
        <path d="M-12,-29.5 q4,-6 11,-7.2" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".35"/>
        <ellipse cx="5" cy="-19" rx="10" ry="11.5" fill="url(#dnb-belly)"/>
        <path d="M-.5,-25 q6,2.2 12,0 M-1,-19.5 q6.4,2.2 12.6,0 M.5,-14 q5,2 10,0"
              stroke="#d6bb7d" stroke-width="1" fill="none" opacity=".8" stroke-linecap="round"/>

        <g class="dnb-leg-near">
          <rect x=".5" y="-15" width="9" height="14.5" rx="4.5" fill="url(#dnb-skin-dark)" stroke="${OL}" stroke-width="1.3"/>
          <ellipse cx="6.2" cy="-1.2" rx="6.5" ry="2.9" fill="#5fa55a" stroke="${OL}" stroke-width="1.3"/>
          <circle cx="11" cy="-1.5" r="1" fill="#fff4d6"/><circle cx="8.6" cy="-.5" r="1" fill="#fff4d6"/>
        </g>

        <g class="dnb-mate" transform="scale(0)">
          <path d="M18.5,-24 L25.8,-35" stroke="#8f979f" stroke-width="2" stroke-linecap="round"/>
          <path d="M18.5,-24 L25.8,-35" stroke="#dfe4e9" stroke-width="1.1" stroke-linecap="round"/>
          <path d="M14.3,-24 C12.6,-18.5 13.4,-11.4 19.5,-10.8 C25.6,-11.4 26.4,-18.5 24.7,-24 Z"
                fill="url(#dnb-gourd)" stroke="#3a2210" stroke-width="1"/>
          <path d="M13.8,-18.5 q5.7,2.2 11.4,0" stroke="#e0b765" stroke-width="1" fill="none"/>
          <ellipse cx="19.5" cy="-24.2" rx="5.4" ry="1.7" fill="#dfe4e9" stroke="#8f979f" stroke-width=".7"/>
          <ellipse cx="19.5" cy="-24.4" rx="4" ry="1" fill="#7a9a33"/>
        </g>

        <g class="dnb-laptop" transform="scale(0)">
          <ellipse class="dnb-screenglow" cx="25" cy="-36" rx="13" ry="10" fill="url(#dnb-screenglow)" opacity="0"/>
          <rect x="12.5" y="-14.6" width="23" height="3.2" rx="1.5" fill="#46413b" stroke="#1a1714" stroke-width=".8"/>
          <rect x="15" y="-15.5" width="14" height="1" rx=".5" fill="#e0b765" opacity=".7"/>
          <g class="dnb-lid">
            <path d="M34.6,-13.5 L30,-31.5" stroke="#1a1714" stroke-width="3.8" stroke-linecap="round"/>
            <path d="M34.6,-13.5 L30,-31.5" stroke="#55504a" stroke-width="2.2" stroke-linecap="round"/>
            <path class="dnb-screen" d="M33.3,-14.6 L29.1,-30.8" stroke="#bfe6ff" stroke-width="1.1" stroke-linecap="round" opacity="0"/>
            <circle cx="33.7" cy="-22.6" r="1.1" fill="#e0b765"/>
          </g>
        </g>

        <g class="dnb-head">
          <path d="M1.5,-54.5 L.5,-62.5 L7.5,-58.5 Z M8,-59.6 L11.5,-67 L15,-60.4 Z M17,-60 L22.5,-64.5 L22.5,-58 Z"
                fill="url(#dnb-spike)" stroke="#b5822f" stroke-width="1.4" stroke-linejoin="round"/>
          <path d="M.5,-39 C-1,-53 7.5,-61 15.5,-60.5 C23,-60 26,-55 27.5,-51 C32,-50 34.5,-45.5 34,-40.5 C33.5,-34.8 28,-32.5 20.5,-32.5 C14,-32.5 8,-31.5 3.5,-30 Z"
                fill="url(#dnb-skin)" stroke="${OL}" stroke-width="1.6" stroke-linejoin="round"/>
          <path d="M6.5,-55 q6,-4.5 14,-2.6" stroke="#fff" stroke-width="1.7" fill="none" stroke-linecap="round" opacity=".4"/>
          <circle cx="7" cy="-44" r="1.6" fill="#3f8a43" opacity=".35"/>
          <circle cx="4.5" cy="-49" r="1.1" fill="#3f8a43" opacity=".35"/>
          <ellipse class="dnb-cheek" cx="24.5" cy="-38" rx="4.2" ry="2.5" fill="#ff8a8f" opacity=".55"/>
          <ellipse cx="30.6" cy="-44.6" rx="1.05" ry=".85" fill="#2c4f2b"/>
          <ellipse cx="28" cy="-45.4" rx=".8" ry=".7" fill="#2c4f2b"/>
          <path class="dnb-smile" d="M24.5,-35.5 q4,3 8.2,-.9" stroke="#24401f" stroke-width="1.4" fill="none" stroke-linecap="round"/>
          <g class="dnb-open" opacity="0">
            <path d="M23.4,-36 q4.6,7.4 9.6,-.9 q-4.8,1.2 -9.6,.9 Z" fill="#7d2f33" stroke="#24401f" stroke-width=".9"/>
            <path d="M26,-33.1 q2.3,2.1 4.6,-.3 q-2.3,-1 -4.6,.3 Z" fill="#ff8f95"/>
            <path d="M25.6,-35.7 l1,1.6 l1,-1.7 Z" fill="#fff"/>
          </g>
          <path class="dnb-brow" d="M13.2,-56.6 q4.2,-2.3 8.6,-.5" stroke="${OL}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
          <g class="dnb-eye">
            <ellipse cx="17.5" cy="-48.5" rx="5.6" ry="6.4" fill="#fff" stroke="${OL}" stroke-width=".9"/>
            <g class="dnb-pupil">
              <circle cx="18.6" cy="-48" r="3.9" fill="url(#dnb-iris)"/>
              <circle cx="18.9" cy="-47.8" r="2.2" fill="#120d08"/>
              <circle cx="20.3" cy="-50.2" r="1.5" fill="#fff"/>
              <circle cx="17.5" cy="-45.9" r=".7" fill="#fff"/>
            </g>
          </g>
          <path class="dnb-happy" d="M13,-47.6 q4.6,-5.2 9.2,0" stroke="#1b1712" stroke-width="1.9" fill="none" stroke-linecap="round" opacity="0"/>
        </g>

        <g class="dnb-arm">
          <path d="M11,-26 q6,.8 8.2,6" stroke="${OL}" stroke-width="6" fill="none" stroke-linecap="round"/>
          <path d="M11,-26 q6,.8 8.2,6" stroke="#5fa55a" stroke-width="4" fill="none" stroke-linecap="round"/>
          <circle cx="19.6" cy="-19" r=".8" fill="#fff4d6"/>
        </g>

      </g></g></g>
    </g>
  </g>

  <g class="dnb-fly" opacity="0">
    <circle r="12" fill="url(#dnb-glow)"/>
    <g class="dnb-wings">
      <ellipse cx="-2.6" cy="-2.6" rx="3.2" ry="1.7" fill="#fff" opacity=".65" transform="rotate(-25 -2.6 -2.6)"/>
      <ellipse cx="2.6" cy="-2.6" rx="3.2" ry="1.7" fill="#fff" opacity=".65" transform="rotate(25 2.6 -2.6)"/>
    </g>
    <circle r="2.3" fill="#fff6d6"/>
  </g>

  <g class="dnb-fx"></g>

  <g class="dnb-bubble" transform="scale(0)">
    <rect y="-31" height="24" rx="12" fill="#f6f1e6"/>
    <path d="M-5,-7.5 L0,0 L5,-7.5 Z" fill="#f6f1e6"/>
    <text y="-14.6" text-anchor="middle" fill="#1c140b">rawr!</text>
  </g>

  <g class="dnb-term" transform="scale(0)">
    <rect y="-50" height="42" rx="8" fill="#0f0d0a" stroke="#c8a45c" stroke-opacity=".7"/>
    <path d="M-5,-8.6 L0,-1 L5,-8.6 Z" fill="#0f0d0a"/>
    <path d="M-5.6,-8.4 L0,-.2 L5.6,-8.4" fill="none" stroke="#c8a45c" stroke-opacity=".7"/>
    <text class="dnb-term-l1" y="-33" fill="#ece6da"></text>
    <text class="dnb-term-l2" y="-17.5" fill="#8fe07c"></text>
  </g>
</svg>`;
  card.appendChild(stage);

  const $ = (sel) => stage.querySelector(sel);
  const svg = $("svg");
  const el = {
    clipwrap: $(".dnb-clipwrap"),
    clipCircle: $(".dnb-clip-circle"),
    clipRect: $(".dnb-clip-rect"),
    shadow: $(".dnb-shadow"),
    dino: $(".dnb-dino"),
    squash: $(".dnb-squash"),
    spin: $(".dnb-spin"),
    bob: $(".dnb-bob"),
    tail: $(".dnb-tail"),
    legFar: $(".dnb-leg-far"),
    legNear: $(".dnb-leg-near"),
    head: $(".dnb-head"),
    cheek: $(".dnb-cheek"),
    smile: $(".dnb-smile"),
    open: $(".dnb-open"),
    brow: $(".dnb-brow"),
    eye: $(".dnb-eye"),
    happy: $(".dnb-happy"),
    pupil: $(".dnb-pupil"),
    arm: $(".dnb-arm"),
    armFar: $(".dnb-arm-far"),
    mate: $(".dnb-mate"),
    laptop: $(".dnb-laptop"),
    lid: $(".dnb-lid"),
    screen: $(".dnb-screen"),
    screenGlow: $(".dnb-screenglow"),
    fly: $(".dnb-fly"),
    wings: $(".dnb-wings"),
    fx: $(".dnb-fx"),
    bubble: $(".dnb-bubble"),
    bubbleRect: $(".dnb-bubble rect"),
    bubbleText: $(".dnb-bubble text"),
    term: $(".dnb-term"),
    termRect: $(".dnb-term rect"),
    termL1: $(".dnb-term-l1"),
    termL2: $(".dnb-term-l2"),
  };

  /* ------------------------------------------------------------------ *
   * Geometry (measured with offsets so AOS transforms don't skew it)
   * ------------------------------------------------------------------ */
  const G = { W: 0, H: 0, cx: 0, cy: 0, r: 80, ri: 76, bx: 0, by: 0, ground: 0, land: 0, k: 1 };

  function measure() {
    G.W = card.clientWidth;
    G.H = card.clientHeight;
    svg.setAttribute("viewBox", `0 0 ${G.W} ${G.H}`);
    const hx = header.offsetLeft;
    const hy = header.offsetTop;
    G.r = photo.offsetWidth / 2;
    const border = parseFloat(getComputedStyle(photo).borderTopWidth) || 0;
    G.ri = G.r - border;
    G.cx = hx + photo.offsetLeft + G.r;
    G.cy = hy + photo.offsetTop + photo.offsetHeight / 2;
    G.k = Math.min(1.25, Math.max(0.8, (G.r / 80) * 1.15));
    if (badge) {
      G.bx = hx + badge.offsetLeft + badge.offsetWidth / 2;
      G.by = hy + badge.offsetTop + badge.offsetHeight / 2;
    }
    G.ground = G.cy + G.r + 2;
    G.land = Math.min(G.cx + G.r + 48 * G.k, G.W - 46 * G.k);
    el.clipCircle.setAttribute("cx", G.cx);
    el.clipCircle.setAttribute("cy", G.cy);
    el.clipCircle.setAttribute("r", G.ri);
    el.clipRect.setAttribute("height", 2000 + G.cy);
  }

  function setClip(on) {
    if (on) el.clipwrap.setAttribute("clip-path", "url(#dnb-clip)");
    else el.clipwrap.removeAttribute("clip-path");
  }

  /* ------------------------------------------------------------------ *
   * State + tiny tween engine on a pausable clock
   * ------------------------------------------------------------------ */
  const POSE = {
    hopY: 0, flip: 1, scale: 1, sx: 1, sy: 1, rot: 0,
    head: 0, headX: 0, arm: 0, wave: 0, armsUp: 0, tuck: 0, mouth: 0, eyeScale: 1,
    happy: 0, blush: 0, walk: 0, tailAmp: 7, tailSpeed: 3.5, shadow: 0, track: false,
    sit: 0, typing: 0, mate: 0, mateOffer: 0, laptop: 0, lid: 0, screen: 0, flyOn: 0,
  };
  const S = Object.assign({
    x: -999, y: -999, walkPhase: 0,
    lookX: 0, lookY: 0, lookTX: 0, lookTY: 0,
    bubble: 0, term: 0, flyX: 0, flyY: 0,
  }, POSE);

  const E = {
    linear: (p) => p,
    in: (p) => p * p * p,
    out: (p) => 1 - Math.pow(1 - p, 3),
    inOut: (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2),
    outBack: (p) => {
      const c1 = 1.70158, c3 = c1 + 1;
      return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2);
    },
  };
  const lerp = (a, b, p) => a + (b - a) * p;

  let clock = 0;
  const tweens = new Set();

  function tween(ms, fn, ease = E.inOut) {
    return new Promise((res) => {
      tweens.add({ start: clock, dur: Math.max(ms, 1) / 1000, fn, ease, res });
    });
  }
  const wait = (ms) => tween(ms, () => {});
  function to(props, ms, ease = E.inOut) {
    const from = {};
    for (const key in props) from[key] = S[key];
    return tween(ms, (p) => {
      for (const key in props) S[key] = lerp(from[key], props[key], p);
    }, ease);
  }
  function look(x, y) { S.lookTX = x; S.lookTY = y; }

  // local dino point -> stage coords (ignores rotation; good enough for fx)
  const world = (lx, ly) => ({
    x: S.x + lx * S.flip * G.k * S.scale,
    y: S.y + S.hopY + ly * G.k * S.scale,
  });

  /* ------------------------------------------------------------------ *
   * Particles: sparkles, hearts, dust, steam
   * ------------------------------------------------------------------ */
  const NS = "http://www.w3.org/2000/svg";
  const SHAPES = {
    star: { d: "M0,-5 Q1,-1 5,0 Q1,1 0,5 Q-1,1 -5,0 Q-1,-1 0,-5Z", fill: "#f3cf73" },
    heart: { d: "M0,2.6 C-5.5,-1.4 -4.6,-6.6 0,-3.8 C4.6,-6.6 5.5,-1.4 0,2.6Z", fill: "#ff7f93" },
    dust: { d: "M-3,0 a3,3 0 1,0 6,0 a3,3 0 1,0 -6,0", fill: "#cdbb98" },
    steam: { d: "M-2.5,0 a2.5,2.5 0 1,0 5,0 a2.5,2.5 0 1,0 -5,0", fill: "#f4efe6" },
  };
  const particles = [];

  function spawn(type, x, y, vx, vy, life, opt = {}) {
    const node = document.createElementNS(NS, "path");
    node.setAttribute("d", SHAPES[type].d);
    node.setAttribute("fill", opt.fill || SHAPES[type].fill);
    el.fx.appendChild(node);
    particles.push({
      node, x, y, vx, vy, life, age: 0, alpha: opt.alpha ?? 1,
      g: opt.g ?? 0, s0: opt.s0 ?? 1, s1: opt.s1 ?? 1,
      rot: Math.random() * 360, vr: opt.vr ?? 0, sway: opt.sway ?? 0,
    });
  }

  function sparkles(x, y, n = 12, spread = 1) {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + Math.random() * 0.5;
      const v = (60 + Math.random() * 90) * spread;
      spawn("star", x, y, Math.cos(a) * v, Math.sin(a) * v - 30, 0.8 + Math.random() * 0.4,
        { g: 160, s0: 0.6 + Math.random() * 0.6, s1: 0.1, vr: 360 * (Math.random() - 0.5) });
    }
  }
  function hearts(x, y, n = 3) {
    for (let i = 0; i < n; i++) {
      spawn("heart", x + (Math.random() - 0.5) * 16, y, (Math.random() - 0.5) * 30, -45 - Math.random() * 30,
        1.3 + Math.random() * 0.5, { g: -8, s0: 0.5, s1: 1.25, sway: 1 });
    }
  }
  function dust(x, y) {
    for (let i = 0; i < 6; i++) {
      const dir = i % 2 ? 1 : -1;
      spawn("dust", x + dir * 8, y - 2, dir * (35 + Math.random() * 45), -8 - Math.random() * 14,
        0.45 + Math.random() * 0.25, { g: 20, s0: 0.6, s1: 1.6 });
    }
  }
  function steam(x, y) {
    spawn("steam", x + (Math.random() - 0.5) * 4, y, (Math.random() - 0.5) * 6, -16 - Math.random() * 8,
      1.2 + Math.random() * 0.4, { g: -4, s0: 0.35, s1: 1.5, sway: 1, alpha: 0.45 });
  }

  function updateParticles(dt) {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.age += dt;
      const t = p.age / p.life;
      if (t >= 1) { p.node.remove(); particles.splice(i, 1); continue; }
      p.vy += p.g * dt;
      p.x += p.vx * dt + (p.sway ? Math.sin(p.age * 6) * 0.4 : 0);
      p.y += p.vy * dt;
      p.rot += p.vr * dt;
      const s = lerp(p.s0, p.s1, t) * G.k;
      p.node.setAttribute("transform", `translate(${p.x} ${p.y}) rotate(${p.rot}) scale(${s})`);
      p.node.setAttribute("opacity", ((1 - t * t) * p.alpha).toFixed(3));
    }
  }

  /* ------------------------------------------------------------------ *
   * Render one frame from state
   * ------------------------------------------------------------------ */
  let nextBlink = 1.5, blinkStart = -1, steamAcc = 0;
  const blinkNow = () => { blinkStart = clock; nextBlink = clock + 2.5 + Math.random() * 2.5; };

  function placeOverhead(node, w, scale, lift) {
    if (scale <= 0.001) { node.setAttribute("transform", "scale(0)"); return; }
    let bx = S.x + S.flip * 12 * G.k;
    bx = Math.min(G.W - w / 2 - 6, Math.max(w / 2 + 6, bx));
    const by = S.y + S.hopY - lift * G.k;
    node.setAttribute("transform", `translate(${bx} ${by}) scale(${scale})`);
  }

  function render(dt) {
    const t = clock;
    const k = G.k;

    if (t > nextBlink) blinkNow();
    const bp = (t - blinkStart) / 0.16;
    const blink = bp >= 0 && bp < 1 ? 1 - Math.sin(bp * Math.PI) * 0.92 : 1;

    // eyes: follow the firefly when tracking, else manual targets
    let tx = S.lookTX, ty = S.lookTY;
    if (S.track && S.flyOn > 0.1) {
      const e = world(17, -48);
      const dx = (S.flyX - e.x) * (S.flip >= 0 ? 1 : -1), dy = S.flyY - e.y;
      const d = Math.hypot(dx, dy) || 1;
      tx = (dx / d) * 1.7; ty = (dy / d) * 1.5;
    }
    const f = Math.min(1, dt * 12);
    S.lookX += (tx - S.lookX) * f;
    S.lookY += (ty - S.lookY) * f;

    const breathe = 1 + Math.sin(t * 2.6) * 0.016;
    const legSwing = Math.sin(S.walkPhase) * 30 * S.walk;
    const bob = -Math.abs(Math.sin(S.walkPhase)) * 2.4 * S.walk + S.sit * 7;
    const tailRot = Math.sin(t * S.tailSpeed) * S.tailAmp;
    const idleHead = Math.sin(t * 1.7) * 2 * (1 - S.typing * 0.7);
    const typeA = S.typing * (32 + Math.sin(t * 30) * 13);
    const typeB = S.typing * (32 + Math.sin(t * 30 + Math.PI) * 13);
    const armRot = S.arm + S.wave * (-70 + Math.sin(t * 16) * 30) + typeA - S.armsUp * 105;
    const armFarRot = S.arm * 0.6 + typeB - S.armsUp * (100 + Math.sin(t * 14) * 12);

    el.dino.setAttribute("transform",
      `translate(${S.x} ${S.y + S.hopY}) scale(${S.flip * k * S.scale} ${k * S.scale})`);
    el.squash.setAttribute("transform", `scale(${S.sx} ${S.sy * breathe})`);
    el.spin.setAttribute("transform", `rotate(${S.rot} 0 -26)`);
    el.bob.setAttribute("transform", `translate(0 ${bob})`);
    el.tail.setAttribute("transform", `rotate(${tailRot} -9 -22)`);
    el.legFar.setAttribute("transform", `rotate(${legSwing + S.tuck * 28 - S.sit * 55} -5 -12)`);
    el.legNear.setAttribute("transform", `rotate(${-legSwing - S.tuck * 38 - S.sit * 75} 5 -12)`);
    el.head.setAttribute("transform", `translate(${S.headX} 0) rotate(${S.head + idleHead} 6 -34)`);
    el.eye.setAttribute("transform",
      `translate(17.5 -48.5) scale(${S.eyeScale} ${S.eyeScale * blink}) translate(-17.5 48.5)`);
    el.eye.setAttribute("opacity", 1 - S.happy);
    el.happy.setAttribute("opacity", S.happy);
    el.brow.setAttribute("transform", `translate(0 ${-(S.eyeScale - 1) * 9 + S.happy * 1.2})`);
    el.pupil.setAttribute("transform", `translate(${S.lookX} ${S.lookY})`);
    el.cheek.setAttribute("opacity", (0.55 + 0.4 * S.blush).toFixed(3));
    el.arm.setAttribute("transform", `rotate(${armRot} 11 -26)`);
    el.armFar.setAttribute("transform", `rotate(${armFarRot} 7 -27.5)`);
    el.smile.setAttribute("opacity", 1 - S.mouth);
    el.open.setAttribute("opacity", S.mouth);

    // props
    el.mate.setAttribute("transform",
      `translate(${4 * S.mateOffer} ${-3 * S.mateOffer}) translate(19.5 -17) scale(${S.mate}) translate(-19.5 17)`);
    el.laptop.setAttribute("transform", `translate(24 -13) scale(${S.laptop}) translate(-24 13)`);
    el.lid.setAttribute("transform", `rotate(${(1 - S.lid) * -76} 34.6 -13.5)`);
    el.screen.setAttribute("opacity", S.screen);
    el.screenGlow.setAttribute("opacity", (S.screen * (0.85 + 0.15 * Math.sin(t * 7))).toFixed(3));

    steamAcc += dt;
    if (S.mate > 0.9 && steamAcc > 0.32) {
      steamAcc = 0;
      const p = world(19.5 + 4 * S.mateOffer, -27 - 3 * S.mateOffer);
      steam(p.x, p.y);
    }

    // ground shadow shrinks as the dino gets airborne
    const lift = Math.max(0, G.ground - (S.y + S.hopY));
    const ss = Math.max(0.25, 1 - lift / 140);
    el.shadow.setAttribute("transform",
      `translate(${S.x} ${G.ground}) scale(${ss * k * S.scale * (1 + S.sit * 0.25)} ${ss * k * S.scale})`);
    el.shadow.setAttribute("opacity", (0.34 * S.shadow * ss).toFixed(3));

    // firefly
    const fx = S.flyX + Math.sin(t * 3.1) * 4, fy = S.flyY + Math.cos(t * 2.3) * 3.5;
    el.fly.setAttribute("transform", `translate(${fx} ${fy}) scale(${k})`);
    el.fly.setAttribute("opacity", (S.flyOn * (0.75 + 0.25 * Math.sin(t * 9))).toFixed(3));
    el.wings.setAttribute("transform", `scale(1 ${0.35 + 0.65 * Math.abs(Math.sin(t * 38))})`);

    // speech bubble + terminal (never mirrored, kept inside the card)
    placeOverhead(el.bubble, bubbleWidth, S.bubble, 66);
    placeOverhead(el.term, termWidth, S.term, 60);
  }

  const textWidth = (node, fallbackPerChar) => {
    let len = 0;
    try { len = node.getComputedTextLength(); } catch (_) { /* not rendered yet */ }
    return len || node.textContent.length * fallbackPerChar;
  };

  let bubbleWidth = 60, sayId = 0;
  async function say(text, ms) {
    const id = ++sayId;
    el.bubbleText.textContent = text;
    bubbleWidth = textWidth(el.bubbleText, 7.5) + 24;
    el.bubbleRect.setAttribute("x", -bubbleWidth / 2);
    el.bubbleRect.setAttribute("width", bubbleWidth);
    await to({ bubble: 1 }, 280, E.outBack);
    await wait(ms);
    if (id === sayId) await to({ bubble: 0 }, 180, E.in);
  }

  // Mini terminal that types itself while the dino codes.
  let termWidth = 150;
  function termSetup(line1, line2) {
    el.termL1.textContent = line1 + " ▋";
    el.termL2.textContent = line2;
    termWidth = Math.max(textWidth(el.termL1, 6.4), textWidth(el.termL2, 6.4)) + 22;
    const x0 = -termWidth / 2;
    el.termRect.setAttribute("x", x0);
    el.termRect.setAttribute("width", termWidth);
    el.termL1.setAttribute("x", x0 + 11);
    el.termL2.setAttribute("x", x0 + 11);
    el.termL1.textContent = "▋";
    el.termL2.textContent = "";
  }
  async function typeLine(node, text, cps = 15) {
    for (let i = 1; i <= text.length; i++) {
      node.textContent = text.slice(0, i) + "▋";
      await wait(1000 / cps + Math.random() * 45);
    }
    node.textContent = text;
  }

  function pulse(node, cls) {
    if (!node) return;
    node.classList.remove(cls);
    void node.offsetWidth; // restart CSS animation
    node.classList.add(cls);
  }

  /* ------------------------------------------------------------------ *
   * Moves
   * ------------------------------------------------------------------ */
  async function land() {
    S.sy = 0.74; S.sx = 1.22; S.tuck = 0;
    dust(S.x, G.ground);
    await to({ sy: 1, sx: 1 }, 320, E.outBack);
  }

  async function hop(dx, h, ms) {
    await to({ sy: 0.84, sx: 1.12 }, 90, E.out);
    const x0 = S.x, y0 = S.y;
    await tween(ms, (p) => {
      const arc = Math.sin(p * Math.PI);
      S.x = x0 + dx * p;
      S.y = y0 - h * 4 * p * (1 - p);
      S.tuck = arc * 0.8;
      S.sy = 1 + 0.12 * arc; S.sx = 1 - 0.06 * arc;
    }, E.linear);
    S.y = y0;
    await land();
  }

  async function walkTo(x, speed) {
    const x0 = S.x, d = x - x0, dist = Math.abs(d);
    if (dist < 1) return;
    const ph0 = S.walkPhase;
    S.walk = 1;
    await tween((dist / speed) * 1000, (p) => {
      S.x = x0 + d * p;
      S.walkPhase = ph0 + (dist * p) / (5.5 * G.k);
    }, E.linear);
    await to({ walk: 0 }, 120);
  }

  const turn = (dir) => to({ flip: dir }, 240, E.inOut);
  const flyTo = (x, y, ms, ease = E.inOut) => to({ flyX: x, flyY: y }, ms, ease);

  async function skipOffRight(speed = 150) {
    const k = G.k;
    if (S.flip < 0) await turn(1);
    S.tailAmp = 14; S.tailSpeed = 10;
    await walkTo(S.x + 40 * k, speed * 0.7);
    await hop(42 * k, 16 * k, 380);
    await walkTo(G.W + 70 * k, speed);
    S.shadow = 0;
  }

  // Leap back into the photo and vanish like through a portal.
  async function diveHome() {
    const k = G.k;
    await turn(-1);
    await to({ sy: 0.8, sx: 1.12 }, 200, E.in);
    pulse(photo, "dino-portal");
    const x0 = S.x, y0 = S.y, x1 = G.cx, y1 = G.cy + 12 * k;
    await tween(850, (p) => {
      const arc = Math.sin(p * Math.PI);
      S.x = lerp(x0, x1, p);
      S.y = lerp(y0, y1, p) - 85 * k * 4 * p * (1 - p);
      S.rot = lerp(0, -200, E.in(p));
      S.tuck = arc;
      S.sy = 1; S.sx = 1;
      S.scale = p < 0.4 ? 1 : 1 - E.inOut((p - 0.4) / 0.6);
      S.shadow = Math.max(0, 1 - p * 2.5);
    }, E.linear);
    sparkles(G.cx, G.cy, 12, 0.7);
    pulse(photo, "dino-portal");
    S.scale = 0;
  }

  /* ------------------------------------------------------------------ *
   * Scenes
   * ------------------------------------------------------------------ */
  // Peek up from inside the photo, then leap out over the rim.
  async function emerge() {
    const k = G.k;
    Object.assign(S, POSE);
    look(0, 0);
    setClip(true);
    S.x = G.cx - 6 * k;
    S.y = G.cy + G.ri + 68 * k; // fully hidden below the circle
    pulse(photo, "dino-portal");

    await to({ y: G.cy + G.ri + 14 * k }, 700, E.outBack);
    await wait(250);
    look(-1.6, 0.2); await to({ head: -6 }, 260); await wait(520);
    look(1.6, -0.3); await to({ head: 8 }, 300); await wait(520);
    blinkNow(); look(0.8, -1); await to({ head: -12 }, 240); await wait(360);

    // anticipation
    await to({ y: S.y + 6 * k, sy: 0.84, sx: 1.1 }, 220, E.in);
    pulse(photo, "dino-portal");

    const x0 = S.x, y0 = S.y, x1 = G.land, y1 = G.ground;
    const apex = Math.max(G.cy - 40 * k, 70 * k);
    const h = (y0 + y1) / 2 - apex;
    look(1, 0.6);
    await tween(900, (p) => {
      const arc = Math.sin(p * Math.PI);
      S.x = lerp(x0, x1, p);
      S.y = lerp(y0, y1, p) - h * 4 * p * (1 - p);
      S.rot = lerp(-10, 14, p);
      S.head = lerp(-12, 6, p);
      S.tuck = arc;
      S.arm = -45 * arc;
      S.sy = 1 + 0.16 * arc; S.sx = 1 - 0.08 * arc;
      // once the feet clear the circle's centre line, the whole dino is "outside"
      if (S.y < G.cy || p > 0.6) setClip(false);
      S.shadow = p > 0.45 ? (p - 0.45) / 0.55 : 0;
    }, E.linear);
    S.rot = 0; S.arm = 0; S.head = 0; S.y = y1;
    await land();
  }

  // Act 1: boop the verified badge, dance, chase a firefly off-stage.
  async function actBoop() {
    const k = G.k;
    await wait(300);
    blinkNow(); look(0.4, -0.6);
    await to({ head: -12 }, 260); await wait(500);
    look(-1.7, 0.7); await to({ head: 0 }, 220); await wait(320);

    if (badge) {
      await turn(-1);
      await walkTo(Math.max(G.bx + 42 * k, G.bx + 10), 70);
      look(1.4, 1.2);
      for (let i = 0; i < 2; i++) {
        await to({ head: 24, headX: 1.2 }, 150);
        await to({ head: 15, headX: 0 }, 150);
      }
      await wait(160);
      await to({ head: -8 }, 180, E.in);
      await to({ head: 40, headX: 4 }, 110, E.in);
      pulse(badge, "dino-boop");
      sparkles(G.bx, G.by, 14);
      S.mouth = 1; S.eyeScale = 1.22; look(0, -0.4);
      await to({ head: -20, headX: 0, rot: -8 }, 280, E.outBack);
      await hop(0, 16 * k, 360);
      await to({ rot: 0, eyeScale: 1, mouth: 0 }, 200);
    }

    // happy dance
    say("rawr! ✨", 1600);
    S.tailAmp = 22; S.tailSpeed = 12; S.wave = 1; S.happy = 1;
    for (let i = 0; i < 2; i++) {
      hearts(S.x, S.y - 60 * k, 2);
      await hop(0, 14 * k, 300);
    }
    await to({ flip: -S.flip }, 180); await to({ flip: -S.flip }, 180); // twirl
    S.wave = 0; S.happy = 0; S.tailAmp = 9; S.tailSpeed = 5;
    await wait(500);

    // a firefly drifts out of the photo...
    S.flyX = G.cx - 12 * k; S.flyY = G.cy + 6 * k; S.track = true;
    to({ flyOn: 1 }, 400);
    pulse(photo, "dino-portal");
    await flyTo(S.x + S.flip * 46 * k, S.y - 66 * k, 1400);
    await wait(450);

    // snap! (miss)
    flyTo(S.x + 30 * k, S.y - 105 * k, 380, E.out);
    S.mouth = 1;
    await to({ head: -30, headX: 3 }, 140, E.out);
    await to({ head: 0, headX: 0 }, 220);
    S.mouth = 0; S.eyeScale = 1.2;
    await wait(250);
    S.eyeScale = 1;

    // chase it off-stage
    flyTo(G.W + 50, S.y - 90 * k, 2200, E.in);
    await turn(1);
    S.tailAmp = 15; S.tailSpeed = 11;
    await walkTo(S.x + 45 * k, 170);
    await hop(45 * k, 24 * k, 420);
    await walkTo(G.W + 70 * k, 200);
    S.track = false; S.flyOn = 0; S.shadow = 0;
  }

  // Act 2: mate break — sip, enjoy, offer one to the visitor, skip away.
  async function actMate() {
    const k = G.k;
    await wait(300);
    blinkNow(); look(0.4, -0.6);
    await to({ head: -10 }, 240);
    say("mate break 🧉", 1100);
    await wait(700);

    const m = world(19.5, -18);
    sparkles(m.x, m.y, 8, 0.45);
    await to({ mate: 1, head: 0 }, 420, E.outBack);
    look(1, 1); await wait(350);

    for (let i = 0; i < 2; i++) {
      await to({ head: 11, happy: 1 }, 280);
      await to({ blush: 1, sy: 1.03 }, 700);  // long slurp
      await to({ head: 2, sy: 1 }, 240);
      await wait(260);
    }
    S.tailAmp = 16; S.tailSpeed = 8;
    hearts(S.x + S.flip * 14 * k, S.y - 62 * k, 3);
    say("ahhh… ☺", 1100);
    await wait(1400);

    // offer the mate to the visitor
    S.happy = 0; look(0.5, -0.4);
    await to({ arm: -28, mateOffer: 1, head: -6 }, 320, E.outBack);
    say("mate? 🧉", 1300);
    await wait(1500);
    await to({ arm: 0, mateOffer: 0, head: 0 }, 260);
    const m2 = world(19.5, -18);
    sparkles(m2.x, m2.y, 8, 0.45);
    await to({ mate: 0, blush: 0 }, 260, E.in);
    S.tailAmp = 7; S.tailSpeed = 3.5;
    await wait(200);

    await skipOffRight();
  }

  // Act 3: wave, backflip, bow, then dive back into the photo.
  async function actFlip() {
    const k = G.k;
    await wait(250);
    look(0.3, -0.5);
    S.wave = 1;
    say("hi! 👋", 1300);
    await wait(1500);
    S.wave = 0;
    await wait(200);

    // backflip
    await to({ sy: 0.78, sx: 1.15 }, 220, E.in);
    const y0 = S.y;
    await tween(820, (p) => {
      const arc = Math.sin(p * Math.PI);
      S.y = y0 - 72 * k * 4 * p * (1 - p);
      S.rot = -360 * E.inOut(p);
      S.tuck = arc;
      S.sy = 1 + 0.12 * arc; S.sx = 1 - 0.06 * arc;
    }, E.linear);
    S.rot = 0; S.y = y0;
    await land();
    sparkles(S.x, S.y - 30 * k, 16, 1.1);
    await wait(250);

    // take a bow
    await to({ head: 32, rot: 14, arm: 40 }, 360);
    await wait(450);
    await to({ head: 0, rot: 0, arm: 0 }, 320, E.outBack);
    S.tailAmp = 20; S.tailSpeed = 11; S.happy = 1;
    say("ship it! 🚀", 1400);
    hearts(S.x, S.y - 60 * k, 3);
    await wait(1700);
    S.tailAmp = 7; S.tailSpeed = 3.5; S.happy = 0;

    await diveHome();
  }

  // Act 4: sit down, open a tiny laptop, type, deploy, celebrate.
  async function actType() {
    const k = G.k;
    await wait(300);
    look(0.4, -0.6); blinkNow();
    say("one sec… 💻", 1000);
    await wait(1300);

    await to({ sit: 1, sy: 0.92 }, 340, E.out);
    await to({ sy: 1 }, 200);
    const lp = world(24, -10);
    sparkles(lp.x, lp.y, 8, 0.5);
    await to({ laptop: 1 }, 380, E.outBack);
    await to({ lid: 1 }, 320, E.outBack);
    await to({ screen: 1, head: 12 }, 280);
    look(1.3, 0.9);

    termSetup("$ git push origin main", "✓ deployed! 🚀");
    await to({ term: 1 }, 280, E.outBack);
    S.typing = 1;
    await typeLine(el.termL1, "$ git push origin main");
    S.typing = 0;
    await wait(250);
    await to({ head: 20 }, 90); await to({ head: 12 }, 140); // hits Enter
    el.termL1.textContent = "$ git push origin main";
    await wait(500);
    el.termL2.textContent = "✓ deployed! 🚀";
    sparkles(S.x + S.flip * 12 * k, S.y - 80 * k, 12, 0.8);

    // celebrate
    look(0, -0.8); S.happy = 1; S.tailAmp = 20; S.tailSpeed = 12;
    await to({ armsUp: 1, head: -12, screen: 0.6 }, 260, E.outBack);
    hearts(S.x, S.y - 58 * k, 3);
    await wait(1200);
    await to({ term: 0 }, 200, E.in);
    await to({ armsUp: 0, head: 0 }, 260);
    S.happy = 0; S.tailAmp = 7; S.tailSpeed = 3.5;

    // pack up
    await to({ lid: 0, screen: 0 }, 260, E.in);
    sparkles(lp.x, lp.y, 8, 0.5);
    await to({ laptop: 0 }, 240, E.in);
    await to({ sit: 0 }, 300, E.outBack);
    await wait(250);

    await diveHome();
  }

  const ACTS = [actBoop, actMate, actFlip, actType];

  async function run() {
    let act = 0;
    await wait(900);
    for (;;) {
      await emerge();
      await ACTS[act++ % ACTS.length]();
      await wait(1100);
    }
  }

  /* ------------------------------------------------------------------ *
   * Interaction: click the dino for a happy hop
   * ------------------------------------------------------------------ */
  let clickBusy = false;
  el.dino.addEventListener("click", () => {
    if (clickBusy) return;
    clickBusy = true;
    hearts(S.x, S.y - 60 * G.k, 4);
    if (S.bubble < 0.1 && S.term < 0.1) say("rawr!", 800);
    S.eyeScale = 1.15;
    tween(440, (p) => { S.hopY = -24 * G.k * 4 * p * (1 - p); }, E.linear).then(() => {
      S.hopY = 0; S.eyeScale = 1; clickBusy = false;
    });
  });

  // Command palette "Say hi to the dino" action.
  window.addEventListener("dino:hello", () => el.dino.dispatchEvent(new MouseEvent("click")));

  /* ------------------------------------------------------------------ *
   * Frame loop (paused when off-screen or tab hidden)
   * ------------------------------------------------------------------ */
  let rafId = 0, last = 0, inView = false;

  function frame(ts) {
    rafId = requestAnimationFrame(frame);
    const dt = Math.min(0.05, Math.max(0, (ts - last) / 1000));
    last = ts;
    clock += dt;
    for (const tw of Array.from(tweens)) {
      const p = Math.min(1, (clock - tw.start) / tw.dur);
      tw.fn(tw.ease(p));
      if (p >= 1) { tweens.delete(tw); tw.res(); }
    }
    updateParticles(dt);
    render(dt);
  }

  function updateActive() {
    const active = inView && !document.hidden;
    if (active && !rafId) {
      last = performance.now();
      rafId = requestAnimationFrame(frame);
    } else if (!active && rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  }

  measure();

  if (reduceMotion) {
    // Static, friendly pose next to the photo; no motion.
    const pose = () => { S.x = G.land; S.y = G.ground; S.flip = -1; S.shadow = 1; render(0); };
    pose();
    new ResizeObserver(() => { measure(); pose(); }).observe(card);
    return;
  }

  new ResizeObserver(measure).observe(card);
  new IntersectionObserver((entries) => {
    inView = entries[0].isIntersecting;
    updateActive();
  }, { threshold: 0.15 }).observe(card);
  document.addEventListener("visibilitychange", updateActive);

  run();
})();
