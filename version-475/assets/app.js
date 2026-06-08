(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    var toggle = document.querySelector('[data-mobile-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (toggle && mobileNav) {
      toggle.addEventListener('click', function () {
        mobileNav.classList.toggle('is-open');
      });
    }

    document.querySelectorAll('[data-hero]').forEach(function (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
      var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
      var prev = hero.querySelector('[data-hero-prev]');
      var next = hero.querySelector('[data-hero-next]');
      var current = 0;
      var timer = null;

      function show(index) {
        if (!slides.length) {
          return;
        }

        current = (index + slides.length) % slides.length;

        slides.forEach(function (slide, i) {
          slide.classList.toggle('is-active', i === current);
        });

        dots.forEach(function (dot, i) {
          dot.classList.toggle('is-active', i === current);
        });
      }

      function start() {
        stop();
        timer = window.setInterval(function () {
          show(current + 1);
        }, 5200);
      }

      function stop() {
        if (timer) {
          window.clearInterval(timer);
          timer = null;
        }
      }

      dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
          show(parseInt(dot.getAttribute('data-hero-dot'), 10));
          start();
        });
      });

      if (prev) {
        prev.addEventListener('click', function () {
          show(current - 1);
          start();
        });
      }

      if (next) {
        next.addEventListener('click', function () {
          show(current + 1);
          start();
        });
      }

      hero.addEventListener('mouseenter', stop);
      hero.addEventListener('mouseleave', start);
      show(0);
      start();
    });

    document.querySelectorAll('[data-filter-input]').forEach(function (input) {
      var list = document.querySelector('[data-filter-list]');
      if (!list) {
        return;
      }

      var params = new URLSearchParams(window.location.search);
      var initialQuery = params.get('q') || '';
      if (input.hasAttribute('data-query-input') && initialQuery) {
        input.value = initialQuery;
      }

      function filter() {
        var query = input.value.trim().toLowerCase();
        var cards = list.querySelectorAll('[data-card="movie"]');

        cards.forEach(function (card) {
          var text = (card.getAttribute('data-search') || '').toLowerCase();
          var matched = !query || text.indexOf(query) !== -1;
          card.classList.toggle('is-hidden', !matched);
        });
      }

      input.addEventListener('input', filter);
      filter();
    });

    var video = document.getElementById('moviePlayer');
    var playCover = document.getElementById('playCover');

    if (video && typeof movieVideoUrl === 'string' && movieVideoUrl) {
      var loaded = false;
      var hlsInstance = null;

      function attach() {
        if (loaded) {
          return;
        }

        loaded = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = movieVideoUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hlsInstance.loadSource(movieVideoUrl);
          hlsInstance.attachMedia(video);
        } else {
          video.src = movieVideoUrl;
        }

        video.load();
      }

      function startPlayback() {
        attach();
        if (playCover) {
          playCover.classList.add('is-hidden');
        }
        var promise = video.play();
        if (promise && typeof promise.catch === 'function') {
          promise.catch(function () {});
        }
      }

      if (playCover) {
        playCover.addEventListener('click', startPlayback);
      }

      video.addEventListener('click', function () {
        if (video.paused) {
          startPlayback();
        } else {
          video.pause();
        }
      });

      video.addEventListener('play', function () {
        if (playCover) {
          playCover.classList.add('is-hidden');
        }
      });

      window.addEventListener('pagehide', function () {
        if (hlsInstance && typeof hlsInstance.destroy === 'function') {
          hlsInstance.destroy();
        }
      });
    }
  });
})();
