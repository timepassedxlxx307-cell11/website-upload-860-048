(function () {
  function selectAll(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  function initMobileNav() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var nav = document.querySelector('[data-mobile-nav]');
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', nav.classList.contains('open') ? 'true' : 'false');
    });
  }

  function initHero() {
    var slider = document.querySelector('[data-hero-slider]');
    if (!slider) {
      return;
    }
    var slides = selectAll('[data-hero-slide]', slider);
    var dots = selectAll('[data-hero-dot]', slider);
    var prev = slider.querySelector('[data-hero-prev]');
    var next = slider.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5600);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        start();
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        start();
      });
    }
    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        show(dotIndex);
        start();
      });
    });
    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function initFilters() {
    selectAll('[data-filter-scope]').forEach(function (scope) {
      var input = scope.querySelector('[data-search-input]');
      var region = scope.querySelector('[data-region-filter]');
      var type = scope.querySelector('[data-type-filter]');
      var year = scope.querySelector('[data-year-filter]');
      var cards = selectAll('[data-movie-card]', scope);
      var empty = scope.querySelector('[data-empty-state]');

      function apply() {
        var query = normalize(input && input.value);
        var regionValue = normalize(region && region.value);
        var typeValue = normalize(type && type.value);
        var yearValue = normalize(year && year.value);
        var visible = 0;

        cards.forEach(function (card) {
          var text = normalize([
            card.getAttribute('data-title'),
            card.getAttribute('data-region'),
            card.getAttribute('data-type'),
            card.getAttribute('data-year'),
            card.getAttribute('data-genre'),
            card.getAttribute('data-tags')
          ].join(' '));
          var matched = true;
          if (query && text.indexOf(query) === -1) {
            matched = false;
          }
          if (regionValue && normalize(card.getAttribute('data-region')).indexOf(regionValue) === -1) {
            matched = false;
          }
          if (typeValue && normalize(card.getAttribute('data-type')).indexOf(typeValue) === -1) {
            matched = false;
          }
          if (yearValue && normalize(card.getAttribute('data-year')) !== yearValue) {
            matched = false;
          }
          card.style.display = matched ? '' : 'none';
          if (matched) {
            visible += 1;
          }
        });

        if (empty) {
          empty.classList.toggle('show', visible === 0);
        }
      }

      [input, region, type, year].forEach(function (control) {
        if (control) {
          control.addEventListener('input', apply);
          control.addEventListener('change', apply);
        }
      });
      apply();
    });
  }

  function attachStream(video, streamUrl) {
    if (video.getAttribute('src')) {
      return;
    }
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
      return;
    }
    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: false,
        backBufferLength: 90
      });
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      video._hls = hls;
      return;
    }
    video.src = streamUrl;
  }

  window.initMoviePlayer = function (config) {
    var video = document.getElementById('movie-player');
    var cover = document.getElementById('player-cover');
    if (!video || !cover || !config || !config.stream) {
      return;
    }

    function startPlayback() {
      attachStream(video, config.stream);
      cover.classList.add('is-hidden');
      video.controls = true;
      var played = video.play();
      if (played && typeof played.catch === 'function') {
        played.catch(function () {});
      }
    }

    cover.addEventListener('click', startPlayback);
    video.addEventListener('click', function () {
      if (!video.getAttribute('src') && !video._hls) {
        startPlayback();
        return;
      }
      if (video.paused) {
        var played = video.play();
        if (played && typeof played.catch === 'function') {
          played.catch(function () {});
        }
      }
    });
  };

  document.addEventListener('DOMContentLoaded', function () {
    initMobileNav();
    initHero();
    initFilters();
  });
})();
