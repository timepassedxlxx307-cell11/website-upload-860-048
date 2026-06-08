function ready(callback) {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", callback);
    } else {
        callback();
    }
}

function setupMenu() {
    const toggle = document.querySelector("[data-menu-toggle]");
    const panel = document.querySelector("[data-mobile-panel]");

    if (!toggle || !panel) {
        return;
    }

    toggle.addEventListener("click", function () {
        panel.classList.toggle("is-open");
    });
}

function setupSearchForms() {
    const forms = document.querySelectorAll("[data-search-form]");

    forms.forEach(function (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            const input = form.querySelector("input[name='q']");
            const value = input ? input.value.trim() : "";
            const target = value ? "search.html?q=" + encodeURIComponent(value) : "search.html";
            window.location.href = target;
        });
    });
}

function setupHero() {
    const hero = document.querySelector("[data-hero]");

    if (!hero) {
        return;
    }

    const slides = Array.from(hero.querySelectorAll(".hero-slide"));
    const dots = Array.from(hero.querySelectorAll("[data-hero-dot]"));
    let current = 0;

    function show(index) {
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle("is-active", slideIndex === current);
        });
        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle("is-active", dotIndex === current);
        });
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
            show(index);
        });
    });

    if (slides.length > 1) {
        window.setInterval(function () {
            show(current + 1);
        }, 5200);
    }
}

function setupFilters() {
    const lists = document.querySelectorAll("[data-filter-list]");

    lists.forEach(function (list) {
        const section = list.closest("section") || document;
        const search = section.querySelector("[data-list-search]");
        const year = section.querySelector("[data-year-filter]");
        const region = section.querySelector("[data-region-filter]");
        const category = section.querySelector("[data-category-filter]");
        const empty = section.querySelector("[data-empty-state]");
        const cards = Array.from(list.querySelectorAll(".movie-card"));
        const params = new URLSearchParams(window.location.search);
        const query = params.get("q");

        if (query && search && !search.value) {
            search.value = query;
        }

        function apply() {
            const text = search ? search.value.trim().toLowerCase() : "";
            const selectedYear = year ? year.value : "";
            const selectedRegion = region ? region.value : "";
            const selectedCategory = category ? category.value : "";
            let visible = 0;

            cards.forEach(function (card) {
                const haystack = [
                    card.dataset.title,
                    card.dataset.genre,
                    card.dataset.region,
                    card.dataset.type,
                    card.dataset.year,
                    card.dataset.category,
                    card.dataset.tags,
                    card.textContent
                ].join(" ").toLowerCase();

                const okText = !text || haystack.includes(text);
                const okYear = !selectedYear || card.dataset.year === selectedYear;
                const okRegion = !selectedRegion || card.dataset.region === selectedRegion;
                const okCategory = !selectedCategory || card.dataset.category === selectedCategory;
                const ok = okText && okYear && okRegion && okCategory;

                card.hidden = !ok;

                if (ok) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.classList.toggle("is-visible", visible === 0);
            }
        }

        [search, year, region, category].forEach(function (control) {
            if (control) {
                control.addEventListener("input", apply);
                control.addEventListener("change", apply);
            }
        });

        apply();
    });
}

function initMoviePlayer(videoSource) {
    const video = document.querySelector("[data-video-player]");
    const cover = document.querySelector("[data-player-cover]");
    const button = document.querySelector("[data-player-action]");

    if (!video || !videoSource) {
        return;
    }

    let mounted = false;

    function mount() {
        if (mounted) {
            return;
        }

        mounted = true;

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = videoSource;
        } else if (window.Hls && window.Hls.isSupported()) {
            const hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(videoSource);
            hls.attachMedia(video);
        } else {
            video.src = videoSource;
        }
    }

    function start() {
        mount();
        video.controls = true;

        if (cover) {
            cover.classList.add("is-hidden");
        }

        const playPromise = video.play();

        if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(function () {});
        }
    }

    if (cover) {
        cover.addEventListener("click", start);
    }

    if (button) {
        button.addEventListener("click", function (event) {
            event.stopPropagation();
            start();
        });
    }

    video.addEventListener("click", function () {
        if (video.paused) {
            start();
        }
    });
}

ready(function () {
    setupMenu();
    setupSearchForms();
    setupHero();
    setupFilters();
});
