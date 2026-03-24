// Année automatique + nav active + tabs + includes + stories
(function () {
  "use strict";

  // Année automatique
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // Nav active (si tu utilises data-page="index.html" etc.)
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".nav a[data-page]").forEach((a) => {
    if ((a.getAttribute("data-page") || "").toLowerCase() === path) {
      a.classList.add("active");
    }
  });

  // Tabs (intercalaires) : gère TOUS les blocs [data-tabs]
  function initTabs() {
    const roots = document.querySelectorAll("[data-tabs]");
    if (!roots.length) return;

    roots.forEach((root) => {
      const buttons = root.querySelectorAll(".tab-btn");
      const panelsWrap = root.querySelector(".tab-panels");
      const panels = root.querySelectorAll(".tab-panel");

      if (!buttons.length || !panelsWrap || !panels.length) return;

      function activate(tabId) {
        panelsWrap.hidden = false;

        panels.forEach((panel) => {
          panel.hidden = panel.id !== tabId;
        });

        buttons.forEach((button) => {
          const isActive = button.dataset.tab === tabId;
          button.classList.toggle("primary", isActive);
          button.setAttribute("aria-selected", isActive ? "true" : "false");
          button.setAttribute("tabindex", isActive ? "0" : "-1");
        });
      }

      // État initial : tout caché
      panelsWrap.hidden = true;
      panels.forEach((panel) => {
        panel.hidden = true;
      });

      buttons.forEach((button) => {
        button.classList.remove("primary");
        button.setAttribute("aria-selected", "false");
        button.setAttribute("tabindex", "0");
      });

      // Click + clavier
      buttons.forEach((btn) => {
        btn.addEventListener("click", () => activate(btn.dataset.tab));

        btn.addEventListener("keydown", (e) => {
          const list = Array.from(buttons);
          const i = list.indexOf(btn);

          if (e.key === "ArrowRight") {
            list[(i + 1) % list.length].focus();
          }

          if (e.key === "ArrowLeft") {
            list[(i - 1 + list.length) % list.length].focus();
          }

          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            activate(btn.dataset.tab);
          }
        });
      });
    });
  }

  // Stories (mode livre)
  function initStories() {
  const pages = document.querySelectorAll(".story-page");
  const prevBtn = document.getElementById("story-prev");
  const nextBtn = document.getElementById("story-next");

  if (!pages.length || !prevBtn || !nextBtn) return;

  let currentIndex = 0;

  function showStory(index) {
    pages.forEach((page, i) => {
      page.classList.toggle("is-active", i === index);
    });
  }

  prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + pages.length) % pages.length;
    showStory(currentIndex);
  });

  nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % pages.length;
    showStory(currentIndex);
  });

  showStory(currentIndex);
}

  // Includes HTML : <div data-include="partials/xxx.html"></div>
  async function loadIncludes() {
    const nodes = document.querySelectorAll("[data-include]");
    if (!nodes.length) return;

    await Promise.all(
      Array.from(nodes).map(async (el) => {
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
      })
    );
  }

  function initStories() {
  const pages = document.querySelectorAll(".story-page");
  const prevBtn = document.getElementById("story-prev");
  const nextBtn = document.getElementById("story-next");

  if (!pages.length || !prevBtn || !nextBtn) return;

  let currentIndex = 0;

  function showStory(index) {
    pages.forEach((page, i) => {
      page.style.display = i === index ? "grid" : "none";
      page.classList.toggle("is-active", i === index);
    });
  }

  prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + pages.length) % pages.length;
    showStory(currentIndex);
  });

  nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % pages.length;
    showStory(currentIndex);
  });

  showStory(currentIndex);
}

  // Initialisation
  async function init() {
    await loadIncludes();
    initTabs();
    initStories();
  }

  init();
})();