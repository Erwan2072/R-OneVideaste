// Année automatique + nav active + tabs (intercalaires)
(function () {
  "use strict";

  // ✅ Année automatique
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // ✅ Nav active (si tu utilises data-page="index.html" etc.)
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".nav a[data-page]").forEach(a => {
    if ((a.getAttribute("data-page") || "").toLowerCase() === path) {
      a.classList.add("active");
    }
  });

  // ✅ Tabs (intercalaires) : rien n'apparaît tant que l'utilisateur n'a pas cliqué
  const root = document.querySelector('[data-tabs="process"]');
  if (!root) return;

  const buttons = root.querySelectorAll(".tab-btn");
  const panelsWrap = root.querySelector(".tab-panels");
  const panels = root.querySelectorAll(".tab-panel");

  if (!buttons.length || !panelsWrap || !panels.length) return;

  function activate(tabId) {
    // Affiche la zone uniquement après action utilisateur
    panelsWrap.hidden = false;

    panels.forEach(p => {
      p.hidden = (p.id !== tabId);
    });

    buttons.forEach(b => {
      const isActive = b.dataset.tab === tabId;
      b.classList.toggle("primary", isActive);
      b.setAttribute("aria-selected", isActive ? "true" : "false");
      b.setAttribute("tabindex", isActive ? "0" : "-1");
    });
  }

  // État initial : tout caché (pas de texte visible)
  panelsWrap.hidden = true;
  panels.forEach(p => (p.hidden = true));
  buttons.forEach(b => {
    b.classList.remove("primary");
    b.setAttribute("aria-selected", "false");
    b.setAttribute("tabindex", "0");
  });

  // Click + clavier
  buttons.forEach(btn => {
    btn.addEventListener("click", () => activate(btn.dataset.tab));

    btn.addEventListener("keydown", (e) => {
      const list = Array.from(buttons);
      const i = list.indexOf(btn);

      if (e.key === "ArrowRight") list[(i + 1) % list.length].focus();
      if (e.key === "ArrowLeft") list[(i - 1 + list.length) % list.length].focus();

      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activate(btn.dataset.tab);
      }
    });
  });
})();
