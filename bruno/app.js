(() => {
  "use strict";

  // The address never appears as plain text in the source: it is stored
  // reversed and split, and only shown once a human interacts with the page.
  const MAILBOX = ["er.uaraoh", "onurb"];
  const email = () => MAILBOX.join(String.fromCharCode(64)).split("").reverse().join("");
  let subject = "";

  const reveal = () => {
    $("email").textContent = email();
    ["pointermove", "touchstart", "keydown", "scroll"].forEach((type) => removeEventListener(type, reveal));
  };
  ["pointermove", "touchstart", "keydown", "scroll"].forEach((type) => addEventListener(type, reveal, { passive: true }));
  const SKILLS = [
    {
      short: "Magento",
      name: "Magento 2 & 1",
      tools: ["PHP 8 / POO", "Magento 2", "MySQL", "Hyvä", "Luma"],
      desc: "Quinze ans sur l'écosystème Magento, du socle d'une boutique à la migration d'une plateforme multi-régions de Magento 1 vers Magento 2.",
      clients: "Descours & Cabaud, OralCare, Rado, Salomon, Wilson",
      example: "Store OralCare monté de A à Z sur thème Hyvä ; nouveau store Rado Canada",
      since: "2011",
    },
    {
      short: "Headless",
      name: "Headless & GraphQL",
      tools: ["Node.js", "GraphQL Mesh", "TypeScript", "API REST", "Next.js"],
      desc: "Une passerelle Node.js qui fédère Magento 2, les micro-services métier et les fronts Next.js derrière une seule API GraphQL.",
      clients: "Descours & Cabaud (6 webshops)",
      example: "Passerelles GraphQL Mesh par marché : unifiée, France, international, Magento",
      since: "2018",
    },
    {
      short: "B2B",
      name: "E-commerce B2B",
      tools: ["Approbations", "Devis", "Tarifs complexes", "TVA multi-taux"],
      desc: "Les règles d'achat des entreprises : comptes sociétés, circuits d'approbation, devis, prix au conditionnement et facturation dématérialisée.",
      clients: "Descours & Cabaud, OralCare, Pro-Living",
      example: "Facturation Chorus, éco-contributions et TVA FR / NL fiabilisées",
      since: "2011",
    },
    {
      short: "Intégrations",
      name: "Intégrations SI & paiement",
      tools: ["Bus d'échange", "ERP", "Adyen", "PayPal", "Global-e", "ForgeRock"],
      desc: "Faire dialoguer la boutique avec le reste du SI : bus de messages, ERP, prestataires de paiement, transporteurs et gestion des identités.",
      clients: "Amer Sports, Pro-Living",
      example: "Passerelles du bus ASBUS (commandes, clients, retours) ; consentements RGPD sur ForgeRock",
      since: "2011",
    },
    {
      short: "Recherche",
      name: "Front & recherche",
      tools: ["Next.js / React", "Algolia", "OpenSearch", "ElasticSuite"],
      desc: "Le parcours d'achat côté client : pages produit, listes, panier, checkout, et un moteur de recherche bien réglé.",
      clients: "Rado, OralCare, Salomon, Descours & Cabaud",
      example: "Refonte du parcours d'achat Rado sur desktop et mobile",
      since: "2018",
    },
    {
      short: "Cloud",
      name: "Cloud & DevOps",
      tools: ["AWS Lambda", "Docker", "GitLab CI", "Git", "Jira"],
      desc: "Micro-services serverless, environnements conteneurisés et déploiements automatisés, en équipe agile.",
      clients: "Amer Sports, Rado, Descours & Cabaud",
      example: "Micro-services AWS Lambda en TypeScript pour l'application Popup",
      since: "2017",
    },
  ];

  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pad = (n) => String(n).padStart(2, "0");
  const $ = (id) => document.getElementById(id);
  const escape = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const thumbs = $("thumbs");
  const variants = $("variants");

  thumbs.innerHTML = SKILLS.map((s, i) =>
    `<button class="thumb" type="button" data-i="${i}" aria-label="${escape(s.name)}"><span class="label">${pad(i + 1)}</span><span>${escape(s.short)}</span></button>`
  ).join("");
  variants.innerHTML = SKILLS.map((s, i) =>
    `<label><input type="radio" name="skill" value="${i}"${i === 0 ? " checked" : ""} /><span>${escape(s.name)}</span></label>`
  ).join("");

  // Shrink the big title until it fits the visual with a margin.
  const fitTitle = () => {
    const el = $("stage-title");
    const room = el.parentElement.clientWidth * 0.86;
    el.style.fontSize = "";
    el.style.whiteSpace = "nowrap";
    el.style.padding = "0";
    let size = parseFloat(getComputedStyle(el).fontSize);
    while (el.scrollWidth > room && size > 24) {
      size -= 2;
      el.style.fontSize = `${size}px`;
    }
  };
  addEventListener("resize", fitTitle);

  const fill = (i) => {
    const s = SKILLS[i];
    $("stage-ref").textContent = `Réf. BH-${pad(i + 1)}`;
    $("stage-title").textContent = s.short;
    fitTitle();
    $("stage-tools").innerHTML = s.tools.map((t) => `<span class="tool">${escape(t)}</span>`).join("");
    $("stage-count").textContent = `${pad(i + 1)} / ${pad(SKILLS.length)}`;
    $("desc").textContent = s.desc;
    $("specs").innerHTML = [
      ["Outils", s.tools.join(", ")],
      ["Chez", s.clients],
      ["Exemple", s.example],
      ["Depuis", s.since],
    ].map(([k, v]) => `<div class="row"><dt class="label">${k}</dt><dd>${escape(v)}</dd></div>`).join("");
    $("skill-name").textContent = s.name;
    subject = `Opportunité : ${s.name}`;
  };

  let active = -1;
  let timer;
  const select = (i) => {
    if (i === active) return;
    const first = active === -1;
    active = i;
    thumbs.querySelectorAll(".thumb").forEach((t, j) => t.setAttribute("aria-current", String(j === i)));
    variants.querySelectorAll("input")[i].checked = true;
    const els = document.querySelectorAll(".fade");
    if (first || reducedMotion) { fill(i); return; }
    els.forEach((el) => el.classList.add("is-out"));
    clearTimeout(timer);
    timer = setTimeout(() => { fill(active); els.forEach((el) => el.classList.remove("is-out")); }, 180);
  };

  thumbs.addEventListener("click", (e) => {
    const t = e.target.closest(".thumb");
    if (t) select(+t.dataset.i);
  });
  variants.addEventListener("change", (e) => select(+e.target.value));

  // Small nod to the shop metaphor: the counter shows how many skills the visitor looked at.
  const seen = new Set();
  const track = () => { seen.add(active); $("bag-count").textContent = String(seen.size); };
  thumbs.addEventListener("click", track);
  variants.addEventListener("change", track);

  const toast = $("toast");
  let toastTimer;
  $("copy").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(email());
      toast.textContent = "Adresse copiée";
    } catch {
      toast.textContent = email();
    }
    toast.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-on"), 2000);
  });

  // The mailto link is only built at click time.
  $("cta").addEventListener("click", (e) => {
    e.preventDefault();
    location.href = `mailto:${email()}?subject=${encodeURIComponent(subject)}`;
  });

  select(0);
})();
