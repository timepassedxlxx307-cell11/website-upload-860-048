(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function initMobileNav() {
    var button = document.querySelector(".menu-toggle");
    var menu = document.querySelector(".mobile-nav");
    if (!button || !menu) {
      return;
    }
    button.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      button.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  function initHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
    if (slides.length <= 1) {
      return;
    }
    var index = 0;
    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, itemIndex) {
        slide.classList.toggle("is-active", itemIndex === index);
      });
      dots.forEach(function (dot, itemIndex) {
        dot.classList.toggle("is-active", itemIndex === index);
      });
    }
    dots.forEach(function (dot, itemIndex) {
      dot.addEventListener("click", function () {
        show(itemIndex);
      });
    });
    setInterval(function () {
      show(index + 1);
    }, 5200);
  }

  function initFilters() {
    var panel = document.querySelector("[data-filter-panel]");
    if (!panel) {
      return;
    }
    var input = panel.querySelector(".search-input");
    var year = panel.querySelector(".year-filter");
    var region = panel.querySelector(".region-filter");
    var genre = panel.querySelector(".genre-filter");
    var items = Array.prototype.slice.call(document.querySelectorAll(".content-item"));

    function value(element) {
      return element ? element.value.trim().toLowerCase() : "";
    }

    function apply() {
      var query = value(input);
      var selectedYear = value(year);
      var selectedRegion = value(region);
      var selectedGenre = value(genre);
      items.forEach(function (item) {
        var text = (item.dataset.search || item.textContent || "").toLowerCase();
        var itemYear = (item.dataset.year || "").toLowerCase();
        var itemRegion = (item.dataset.region || "").toLowerCase();
        var itemGenre = (item.dataset.genre || "").toLowerCase();
        var matched = true;
        if (query && text.indexOf(query) === -1) {
          matched = false;
        }
        if (selectedYear && itemYear !== selectedYear) {
          matched = false;
        }
        if (selectedRegion && itemRegion !== selectedRegion) {
          matched = false;
        }
        if (selectedGenre && itemGenre.indexOf(selectedGenre) === -1) {
          matched = false;
        }
        item.classList.toggle("is-filtered-out", !matched);
      });
    }

    [input, year, region, genre].forEach(function (element) {
      if (element) {
        element.addEventListener("input", apply);
        element.addEventListener("change", apply);
      }
    });
  }

  ready(function () {
    initMobileNav();
    initHero();
    initFilters();
  });
})();
