(function () {
  "use strict";

  const mount = document.getElementById("systems-orrery");
  if (!mount) return;

  const CATEGORIES = [
    {
      id: "frontend",
      label: "Front-End",
      icon: "bi-display",
      angle: -90,
      skills: [
        { abbr: "Ng", name: "Angular", pct: 90, desc: "Extensive experience building enterprise SPAs with Angular, RxJS, and component-based architecture." },
        { abbr: "Re", name: "React / Next.js", pct: 70, desc: "Solid experience with React hooks, state management, and Next.js for server-rendered apps." },
        { abbr: "Ts", name: "TypeScript / JavaScript", pct: 85, desc: "Strong command of ES6+, typed codebases, and modern tooling across frontend and backend." },
        { abbr: "Tw", name: "Tailwind CSS", pct: 65, desc: "Utility-first styling for fast, consistent UI development." },
      ],
    },
    {
      id: "backend",
      label: "Back-End",
      icon: "bi-hdd-rack",
      angle: -18,
      skills: [
        { abbr: "C#", name: "ASP.NET Core (C#)", pct: 85, desc: "Designing and maintaining REST APIs in C# / ASP.NET Core for enterprise applications." },
        { abbr: "No", name: "Node.js", pct: 70, desc: "Server-side JavaScript development with Express and REST APIs." },
        { abbr: "Py", name: "Python / Go", pct: 65, desc: "Working knowledge of Python and Go for scripting, automation, and backend services." },
      ],
    },
    {
      id: "data",
      label: "Data",
      icon: "bi-database",
      angle: 54,
      skills: [
        { abbr: "Db", name: "SQL Server", pct: 85, desc: "Database design, query optimization, and administration for enterprise systems." },
        { abbr: "Pg", name: "PostgreSQL", pct: 70, desc: "Comfortable with relational schema design and queries in PostgreSQL." },
        { abbr: "Fb", name: "Firebase", pct: 65, desc: "Experience with Firestore, authentication, and hosting for small-scale apps." },
      ],
    },
    {
      id: "devops",
      label: "DevOps",
      icon: "bi-gear-wide-connected",
      angle: 126,
      skills: [
        { abbr: "Az", name: "Azure DevOps (CI/CD)", pct: 85, desc: "Building and maintaining CI/CD pipelines and release automation in Azure DevOps." },
        { abbr: "Do", name: "Docker / Nginx", pct: 80, desc: "Containerizing applications with Docker and configuring Nginx as a reverse proxy." },
        { abbr: "Gt", name: "Git · GitHub · GitLab · Jira", pct: 85, desc: "Version control workflows and agile project tracking across Git, GitHub, GitLab, and Jira." },
      ],
    },
    {
      id: "ai",
      label: "AI Dev",
      icon: "bi-cpu",
      angle: 198,
      skills: [
        { abbr: "Ai", name: "Claude Code / GitHub Copilot", pct: 80, desc: "Daily use of AI coding assistants to speed up development, refactoring, and code review." },
        { abbr: "Ll", name: "LLM API Integration", pct: 65, desc: "Integrating OpenAI / Anthropic APIs into applications for features like chat, summarization, and automation." },
      ],
    },
  ];

  // Per-cluster lateral offsets (in canvas units, perpendicular to the
  // hub's outward direction) used to fan skill nodes out around their
  // hub without touching it or each other.
  const LATERAL_OFFSETS = {
    2: [-9, 9],
    3: [-16, 0, 16],
    4: [-25, -9, 9, 25],
  };

  const CORE = { x: 50, y: 50 };
  const HUB_RADIUS = 28;
  const HUB_MOON_GAP = 17;

  function polar(cx, cy, r, angleDeg) {
    const rad = (angleDeg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  // Point offset from `origin`, `out` units along the direction away
  // from the canvas center and `lateral` units perpendicular to it.
  function fanPoint(origin, angleDeg, out, lateral) {
    const rad = (angleDeg * Math.PI) / 180;
    const ux = Math.cos(rad);
    const uy = Math.sin(rad);
    return {
      x: origin.x + ux * out - uy * lateral,
      y: origin.y + uy * out + ux * lateral,
    };
  }

  function moonSize(pct) {
    return 7 + ((pct - 65) / 25) * 5;
  }

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("preserveAspectRatio", "none");
  svg.setAttribute("aria-hidden", "true");

  const orbitRing = document.createElementNS(svgNS, "circle");
  orbitRing.setAttribute("cx", "50");
  orbitRing.setAttribute("cy", "50");
  orbitRing.setAttribute("r", String(HUB_RADIUS));
  orbitRing.setAttribute("class", "orrery-ring");
  svg.appendChild(orbitRing);

  const lines = [];
  const nodes = [];

  function addLine(a, b, categoryId, skillId) {
    const line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1", a.x);
    line.setAttribute("y1", a.y);
    line.setAttribute("x2", b.x);
    line.setAttribute("y2", b.y);
    line.setAttribute("class", "orrery-line");
    line.dataset.category = categoryId;
    if (skillId) line.dataset.skill = skillId;
    svg.appendChild(line);
    lines.push(line);
  }

  function makeNode({ x, y, size, className, html, dataset, label, delay }) {
    const el = document.createElement("button");
    el.type = "button";
    el.className = "orrery-node " + className;
    el.style.left = x + "%";
    el.style.top = y + "%";
    el.style.width = size + "%";
    el.style.height = size + "%";
    if (delay) el.style.animationDelay = delay + "s";
    el.innerHTML = html;
    Object.entries(dataset || {}).forEach(([k, v]) => {
      el.dataset[k] = v;
    });
    if (label) el.setAttribute("aria-label", label);
    mount.appendChild(el);
    nodes.push(el);
    return el;
  }

  // Central core node
  makeNode({
    x: CORE.x,
    y: CORE.y,
    size: 21,
    className: "node-core",
    html: '<i class="bi bi-diagram-3" aria-hidden="true"></i><span class="node-label">Systems</span>',
    dataset: { role: "core" },
    label: "Full-stack systems core. Select to reset the view.",
  });

  CATEGORIES.forEach((cat, ci) => {
    const hubPos = polar(CORE.x, CORE.y, HUB_RADIUS, cat.angle);
    addLine(CORE, hubPos, cat.id);

    makeNode({
      x: hubPos.x,
      y: hubPos.y,
      size: 19,
      className: "node-hub",
      html:
        '<i class="bi ' + cat.icon + '" aria-hidden="true"></i>' +
        '<span class="node-label">' + cat.label + '</span>',
      dataset: { role: "hub", category: cat.id },
      label: cat.label + " subsystem. Select to trace its connections.",
      delay: ci * 0.55,
    });

    const laterals = LATERAL_OFFSETS[cat.skills.length];
    cat.skills.forEach((skill, si) => {
      const moonPos = fanPoint(hubPos, cat.angle, HUB_MOON_GAP, laterals[si]);
      const skillId = cat.id + "-" + si;
      addLine(hubPos, moonPos, cat.id, skillId);

      makeNode({
        x: moonPos.x,
        y: moonPos.y,
        size: moonSize(skill.pct),
        className: "node-skill",
        html:
          '<span class="node-abbr">' + skill.abbr + '</span>' +
          '<span class="orrery-tooltip" aria-hidden="true"><strong>' + skill.name + '</strong>' + skill.desc + ' · ' + skill.pct + '%</span>',
        dataset: { role: "skill", category: cat.id, skill: skillId },
        label: skill.name + ", " + skill.pct + " percent. " + skill.desc,
        delay: si * 0.4 + 0.2,
      });
    });
  });

  mount.appendChild(svg);

  let activeKey = null;

  function applyFocus(key) {
    activeKey = key;
    const isFocused = !!key;
    mount.classList.toggle("is-focused", isFocused);

    nodes.forEach((el) => {
      const role = el.dataset.role;
      let lit = !isFocused || role === "core";
      if (isFocused && role !== "core") {
        if (key.type === "category") {
          lit = el.dataset.category === key.category;
        } else {
          lit = el.dataset.category === key.category && (role === "hub" || el.dataset.skill === key.skill);
        }
      }
      el.classList.toggle("is-dim", isFocused && !lit);
      el.classList.toggle("is-lit", isFocused && lit && role !== "core");
    });

    lines.forEach((line) => {
      let lit = !isFocused;
      if (isFocused) {
        if (key.type === "category") {
          lit = line.dataset.category === key.category;
        } else {
          lit = line.dataset.category === key.category && (!line.dataset.skill || line.dataset.skill === key.skill);
        }
      }
      line.classList.toggle("is-dim", isFocused && !lit);
      line.classList.toggle("is-lit", isFocused && lit);
    });
  }

  mount.addEventListener("click", (e) => {
    const node = e.target.closest(".orrery-node");
    if (!node) {
      applyFocus(null);
      return;
    }
    const { role, category, skill } = node.dataset;
    if (role === "core") {
      applyFocus(null);
      return;
    }
    const key = role === "hub" ? { type: "category", category } : { type: "skill", category, skill };
    const same = activeKey && activeKey.type === key.type && activeKey.category === key.category && activeKey.skill === key.skill;
    applyFocus(same ? null : key);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && activeKey) applyFocus(null);
  });
})();
