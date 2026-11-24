(function () {
  "use strict";

  var root = document.querySelector("[data-search]");
  if (!root) return;

  var input = root.querySelector(".search-input");
  var panel = root.querySelector(".search-results");
  var indexUrl = root.getAttribute("data-index-url");
  var posts = null;
  var loadingPromise = null;
  var activeIndex = -1;

  function loadIndex() {
    if (posts) return Promise.resolve(posts);

    if (!loadingPromise) {
      loadingPromise = fetch(indexUrl)
        .then(function (response) {
          if (!response.ok) throw new Error("HTTP " + response.status);
          return response.json();
        })
        .then(function (data) {
          posts = Array.isArray(data) ? data : [];
          return posts;
        })
        .catch(function () {
          posts = [];
          return posts;
        });
    }

    return loadingPromise;
  }

  function normalize(value) {
    return (value || "").toString().toLowerCase();
  }

  function close() {
    panel.hidden = true;
    input.setAttribute("aria-expanded", "false");
    input.removeAttribute("aria-activedescendant");
    activeIndex = -1;
  }

  function setActive(index) {
    var items = panel.querySelectorAll(".search-result");
    if (!items.length) return;

    activeIndex = (index + items.length) % items.length;

    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var selected = i === activeIndex;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-selected", selected ? "true" : "false");
    }

    var active = items[activeIndex];
    input.setAttribute("aria-activedescendant", active.id);
    active.scrollIntoView({ block: "nearest" });
  }

  function render(list, query) {
    panel.innerHTML = "";

    if (!query) {
      close();
      return;
    }

    if (!list.length) {
      var empty = document.createElement("p");
      empty.className = "search-empty";
      empty.textContent = "没有找到相关文章";
      panel.appendChild(empty);
    } else {
      list.forEach(function (post, index) {
        var link = document.createElement("a");
        link.className = "search-result";
        link.href = post.url;
        link.id = "search-result-" + index;
        link.setAttribute("role", "option");
        link.setAttribute("aria-selected", "false");

        var title = document.createElement("span");
        title.className = "search-result-title";
        title.textContent = post.title;

        var meta = document.createElement("span");
        meta.className = "search-result-meta";
        meta.textContent = [post.date, post.categories]
          .filter(Boolean)
          .join(" · ");

        link.appendChild(title);
        link.appendChild(meta);
        panel.appendChild(link);
      });
    }

    activeIndex = -1;
    panel.hidden = false;
    input.setAttribute("aria-expanded", "true");
    input.removeAttribute("aria-activedescendant");
  }

  function update() {
    var query = input.value.trim();
    if (!query) {
      close();
      return;
    }

    loadIndex().then(function (data) {
      if (input.value.trim() !== query) return;

      var needle = normalize(query);
      var matches = data
        .filter(function (post) {
          return (
            normalize(post.title).indexOf(needle) !== -1 ||
            normalize(post.categories).indexOf(needle) !== -1 ||
            normalize(post.content).indexOf(needle) !== -1
          );
        })
        .slice(0, 8);

      render(matches, query);
    });
  }

  input.addEventListener("focus", function () {
    loadIndex().then(function () {
      if (input.value.trim()) update();
    });
  });

  input.addEventListener("input", update);

  input.addEventListener("keydown", function (event) {
    var items = panel.querySelectorAll(".search-result");

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (panel.hidden && input.value.trim()) {
        update();
        return;
      }
      setActive(activeIndex + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (panel.hidden && input.value.trim()) {
        update();
        return;
      }
      setActive(activeIndex - 1);
    } else if (event.key === "Enter") {
      if (!items.length) return;
      event.preventDefault();
      var target = items[activeIndex >= 0 ? activeIndex : 0];
      if (target) window.location.href = target.href;
    } else if (event.key === "Escape") {
      event.preventDefault();
      close();
      input.blur();
    }
  });

  document.addEventListener("click", function (event) {
    if (!root.contains(event.target)) close();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !panel.hidden) close();
  });
})();
