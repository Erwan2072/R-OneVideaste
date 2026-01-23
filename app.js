// Année automatique + nav active + tabs (intercalaires)
(function () {
  "use strict";

  // Année automatique
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // Nav active (si tu utilises data-page="index.html" etc.)
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".nav a[data-page]").forEach(a => {
    if ((a.getAttribute("data-page") || "").toLowerCase() === path) {
      a.classList.add("active");
    }
  });

  // Tabs (intercalaires) : gère TOUS les blocs [data-tabs]
  const roots = document.querySelectorAll("[data-tabs]");
  if (!roots.length) return;

  roots.forEach((root) => {
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
  });
})();


  // ✅ Includes HTML : <div data-include="partials/xxx.html"></div>
  async function loadIncludes() {
    const nodes = document.querySelectorAll("[data-include]");
    if (!nodes.length) return;

    await Promise.all(Array.from(nodes).map(async (el) => {
      const url = el.getAttribute("data-include");
      if (!url) return;

      try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
        el.innerHTML = await res.text();
      } catch (err) {
        console.error("Include error:", err);
        el.innerHTML = `<p class="muted">Impossible de charger: <code>${url}</code></p>`;
      }
    }));
  }

  // Lance les includes dès que possible
  loadIncludes();
