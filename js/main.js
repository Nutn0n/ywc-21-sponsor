(function () {
  var types = { paid: true, support: true, media: true };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function currentType() {
    var type = location.hash.replace("#", "");
    return types[type] ? type : "";
  }

  function syncType(scroll) {
    var type = currentType();
    var hash = location.hash;
    if (type) document.documentElement.dataset.type = type;
    else if (!hash || hash === "#top" || hash === "#choose") document.documentElement.dataset.type = "";

    var active = document.documentElement.dataset.type || "";
    document.querySelectorAll("[data-choose]").forEach(function (el) {
      var on = el.getAttribute("data-choose") === active;
      if (on) el.setAttribute("aria-current", "true");
      else el.removeAttribute("aria-current");
    });
    if (type && scroll) {
      var panel = document.getElementById(type);
      if (panel) {
        panel.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      }
    }
  }

  window.addEventListener("hashchange", function () {
    syncType(true);
  });
  syncType(false);

  var picks = document.querySelectorAll("[data-tier-pick]");

  function setTier(tier) {
    var current = document.body.dataset.activeTier || "";
    var next = current === tier ? "" : tier;
    document.body.dataset.activeTier = next;
    picks.forEach(function (el) {
      if (el.classList.contains("tier-card")) {
        el.setAttribute("aria-pressed", String(el.dataset.tierPick === next));
      }
    });
  }

  picks.forEach(function (el) {
    el.addEventListener("click", function () {
      setTier(el.dataset.tierPick);
    });
  });
})();
