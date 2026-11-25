(function () {
  "use strict";

  var root = document.querySelector("[data-tag-filter]");
  if (!root) return;

  var chips = Array.prototype.slice.call(root.querySelectorAll("[data-tag]"));
  var modeButtons = Array.prototype.slice.call(root.querySelectorAll("[data-tag-mode]"));
  var clearButton = root.querySelector("[data-tag-clear]");
  var status = root.querySelector("[data-tag-status]");
  var groups = Array.prototype.slice.call(document.querySelectorAll("[data-category-section]"));
  var cloudLinks = Array.prototype.slice.call(document.querySelectorAll("[data-category-link]"));
  var cloud = document.querySelector(".category-cloud");
  var empty = document.querySelector("[data-filter-empty]");
  var selected = new Set();
  var mode = "any";

  function tagsOf(item) {
    try {
      var parsed = JSON.parse(item.getAttribute("data-tags") || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function matches(tags) {
    if (selected.size === 0) return true;

    var wanted = Array.from(selected);
    if (mode === "all") {
      return wanted.every(function (tag) {
        return tags.indexOf(tag) !== -1;
      });
    }

    return wanted.some(function (tag) {
      return tags.indexOf(tag) !== -1;
    });
  }

  function apply() {
    var active = selected.size > 0;
    var visibleUrls = new Set();

    chips.forEach(function (chip) {
      var isActive = selected.has(chip.getAttribute("data-tag"));
      chip.classList.toggle("is-active", isActive);
      chip.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    modeButtons.forEach(function (button) {
      var isActive = button.getAttribute("data-tag-mode") === mode;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    clearButton.hidden = !active;

    groups.forEach(function (group) {
      var items = Array.prototype.slice.call(group.querySelectorAll(".category-posts li"));
      var visible = 0;

      items.forEach(function (item) {
        var show = matches(tagsOf(item));
        item.hidden = !show;

        if (show) {
          visible += 1;
          var url = item.getAttribute("data-post-url");
          if (url) visibleUrls.add(url);
        }
      });

      group.hidden = visible === 0;

      var count = group.querySelector("[data-visible-count]");
      if (count) count.textContent = visible;

      var category = group.getAttribute("data-category-section");
      var cloudLink = cloudLinks.find(function (link) {
        return link.getAttribute("data-category-link") === category;
      });
      if (cloudLink) cloudLink.hidden = visible === 0;
    });

    if (!active) {
      status.textContent = "选择标签筛选文章；选择多个标签时可切换“任一 / 全部”。";
    } else {
      status.textContent =
        "已选：" + Array.from(selected).join("、") +
        " · " + (mode === "all" ? "全部标签" : "任一标签") +
        " · 显示 " + visibleUrls.size + " 篇文章";
    }

    if (empty) empty.hidden = !active || visibleUrls.size > 0;

    if (cloud) {
      cloud.hidden = !cloudLinks.some(function (link) {
        return !link.hidden;
      });
    }
  }

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var tag = chip.getAttribute("data-tag");
      if (selected.has(tag)) selected.delete(tag);
      else selected.add(tag);
      apply();
    });
  });

  modeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      mode = button.getAttribute("data-tag-mode") || "any";
      apply();
    });
  });

  clearButton.addEventListener("click", function () {
    selected.clear();
    apply();
  });

  apply();
})();
