(function () {
  var types = { paid: true, support: true, media: true };
  var tiers = ["title", "vip", "platinum", "gold", "silver"];
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll("#matrix [data-bits], #matrix [data-values]").forEach(function (row) {
    var bits = row.getAttribute("data-bits");
    var values = bits ? bits.split("") : row.getAttribute("data-values").split("|");
    values.forEach(function (value, index) {
      var cell = document.createElement("td");
      cell.dataset.tier = tiers[index];
      if (bits) {
        var on = value === "1";
        cell.innerHTML = on
          ? '<span class="mark">✓</span><span class="sr">มี</span>'
          : '<span class="dash">–</span><span class="sr">ไม่มี</span>';
      } else {
        cell.textContent = value;
      }
      row.appendChild(cell);
    });
  });

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
      if (el.getAttribute("data-choose") === active) el.setAttribute("aria-current", "true");
      else el.removeAttribute("aria-current");
    });

    if (!type || !scroll) return;
    var panel = document.getElementById(type);
    if (panel) panel.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }

  window.addEventListener("hashchange", function () { syncType(true); });
  syncType(false);

  var picks = document.querySelectorAll("[data-tier-pick]");

  function setTier(tier) {
    var next = document.body.dataset.activeTier === tier ? "" : tier;
    document.body.dataset.activeTier = next;
    picks.forEach(function (el) {
      if (el.classList.contains("tier-card")) {
        el.setAttribute("aria-pressed", String(el.dataset.tierPick === next));
      }
    });
  }

  picks.forEach(function (el) {
    el.addEventListener("click", function () { setTier(el.dataset.tierPick); });
  });
})();
