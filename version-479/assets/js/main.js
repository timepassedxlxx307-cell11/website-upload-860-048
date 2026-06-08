(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    ready(function () {
        var toggle = document.querySelector("[data-menu-toggle]");
        var mobileNav = document.querySelector("[data-mobile-nav]");
        if (toggle && mobileNav) {
            toggle.addEventListener("click", function () {
                mobileNav.classList.toggle("open");
            });
        }

        var hero = document.querySelector("[data-hero]");
        if (hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
            var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
            var current = 0;
            var timer = null;
            var showSlide = function (index) {
                current = (index + slides.length) % slides.length;
                slides.forEach(function (slide, position) {
                    slide.classList.toggle("active", position === current);
                });
                dots.forEach(function (dot, position) {
                    dot.classList.toggle("active", position === current);
                });
            };
            var start = function () {
                timer = window.setInterval(function () {
                    showSlide(current + 1);
                }, 5200);
            };
            dots.forEach(function (dot, index) {
                dot.addEventListener("click", function () {
                    if (timer) {
                        window.clearInterval(timer);
                    }
                    showSlide(index);
                    start();
                });
            });
            if (slides.length > 1) {
                start();
            }
        }

        var input = document.querySelector("[data-search-input]");
        var cards = Array.prototype.slice.call(document.querySelectorAll("[data-search-card]"));
        var status = document.querySelector("[data-filter-status]");
        var category = "all";
        var type = "all";
        var params = new URLSearchParams(window.location.search);
        var initialQuery = params.get("q") || "";

        if (input && initialQuery) {
            input.value = initialQuery;
        }

        function normalize(value) {
            return (value || "").toString().trim().toLowerCase();
        }

        function applyFilters() {
            var query = normalize(input ? input.value : "");
            var visible = 0;
            cards.forEach(function (card) {
                var haystack = normalize([
                    card.getAttribute("data-title"),
                    card.getAttribute("data-region"),
                    card.getAttribute("data-type"),
                    card.getAttribute("data-year"),
                    card.getAttribute("data-tags")
                ].join(" "));
                var matchQuery = !query || haystack.indexOf(query) !== -1;
                var matchCategory = category === "all" || card.getAttribute("data-category") === category;
                var matchType = type === "all" || card.getAttribute("data-type") === type;
                var show = matchQuery && matchCategory && matchType;
                card.classList.toggle("hidden", !show);
                if (show) {
                    visible += 1;
                }
            });
            if (status) {
                status.textContent = visible > 0 ? "为你找到相关影片" : "暂无匹配影片";
            }
        }

        if (input && cards.length) {
            input.addEventListener("input", applyFilters);
        }

        document.querySelectorAll("[data-filter-category]").forEach(function (button) {
            button.addEventListener("click", function () {
                category = button.getAttribute("data-filter-category") || "all";
                document.querySelectorAll("[data-filter-category]").forEach(function (item) {
                    item.classList.toggle("active", item === button);
                });
                applyFilters();
            });
        });

        document.querySelectorAll("[data-filter-type]").forEach(function (button) {
            button.addEventListener("click", function () {
                type = button.getAttribute("data-filter-type") || "all";
                document.querySelectorAll("[data-filter-type]").forEach(function (item) {
                    item.classList.toggle("active", item === button);
                });
                applyFilters();
            });
        });

        if (cards.length) {
            applyFilters();
        }
    });
})();
