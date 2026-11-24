(function () {
  if (window.__giscusFallbackInit) return;
  window.__giscusFallbackInit = true;

  window.addEventListener("message", function (event) {
    if (event.origin !== "https://giscus.app") return;

    var payload = event.data;
    if (!payload || !payload.giscus || !payload.giscus.error) return;

    var message = String(payload.giscus.error);
    if (message.indexOf("not installed") === -1) return;

    document.querySelectorAll("[data-giscus]").forEach(function (block) {
      var container = block.querySelector(".giscus-container");
      var fallback = block.querySelector(".giscus-fallback");

      if (container) container.hidden = true;
      if (fallback) fallback.hidden = false;
    });
  });
})();
