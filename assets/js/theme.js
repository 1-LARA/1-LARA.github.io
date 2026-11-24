(function () {
  "use strict";

  var root = document.documentElement;
  var toggle = document.querySelector("[data-theme-toggle]");
  var storageKey = "theme";
  var media = window.matchMedia
    ? window.matchMedia("(prefers-color-scheme: dark)")
    : null;
  var pendingGiscusSync = false;

  function storedTheme() {
    try {
      var value = localStorage.getItem(storageKey);
      return value === "dark" || value === "light" ? value : null;
    } catch (error) {
      return null;
    }
  }

  function currentTheme() {
    return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function syncGiscus() {
    if (!window.__giscusReady) {
      pendingGiscusSync = true;
      return;
    }

    var theme = currentTheme();
    document.querySelectorAll("iframe.giscus-frame").forEach(function (frame) {
      if (frame.contentWindow) {
        frame.contentWindow.postMessage(
          { giscus: { setConfig: { theme: theme } } },
          "https://giscus.app"
        );
      }
    });
  }

  window.__giscusOnReady = function () {
    if (!pendingGiscusSync) return;
    pendingGiscusSync = false;
    syncGiscus();
  };

  function updateToggle(theme) {
    if (!toggle) return;
    var dark = theme === "dark";
    toggle.setAttribute("aria-pressed", dark ? "true" : "false");
    toggle.setAttribute("aria-label", dark ? "切换到浅色模式" : "切换到深色模式");
    toggle.setAttribute("title", dark ? "切换到浅色模式" : "切换到深色模式");
  }

  function applyTheme(theme, persist) {
    root.setAttribute("data-theme", theme);
    updateToggle(theme);

    if (persist) {
      try {
        localStorage.setItem(storageKey, theme);
      } catch (error) {}
    }

    syncGiscus();
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      applyTheme(currentTheme() === "dark" ? "light" : "dark", true);
    });
  }

  updateToggle(currentTheme());

  if (media) {
    var handleSystemChange = function (event) {
      if (storedTheme()) return;
      applyTheme(event.matches ? "dark" : "light", false);
    };

    if (media.addEventListener) {
      media.addEventListener("change", handleSystemChange);
    } else if (media.addListener) {
      media.addListener(handleSystemChange);
    }
  }

  // 主题切换时同步已加载的 giscus 评论区
})();