(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var toggle = document.querySelector("[data-menu-toggle]");
  var nav = document.getElementById("site-nav");
  var media = window.matchMedia("(max-width: 700px)");

  if (!header || !toggle || !nav) return;

  function setOpen(open) {
    header.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "关闭导航菜单" : "打开导航菜单");
    toggle.setAttribute("title", open ? "关闭导航菜单" : "打开导航菜单");
  }

  toggle.addEventListener("click", function () {
    setOpen(!header.classList.contains("nav-open"));
  });

  nav.addEventListener("click", function (event) {
    if (event.target.closest("a")) setOpen(false);
  });

  document.addEventListener("click", function (event) {
    if (header.contains(event.target)) return;
    setOpen(false);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    if (!header.classList.contains("nav-open")) return;
    setOpen(false);
    toggle.focus();
  });

  function handleViewportChange(event) {
    if (!event.matches) setOpen(false);
  }

  if (media.addEventListener) {
    media.addEventListener("change", handleViewportChange);
  } else if (media.addListener) {
    media.addListener(handleViewportChange);
  }
})();
