(function () {
  function initPlayer(streamUrl) {
    var video = document.querySelector(".video-player");
    var cover = document.querySelector(".player-cover");
    var button = document.querySelector(".play-button");
    var loaded = false;
    var hlsInstance = null;

    if (!video || !streamUrl) {
      return;
    }

    function load() {
      if (loaded) {
        return;
      }
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(streamUrl);
        hlsInstance.attachMedia(video);
      } else {
        video.src = streamUrl;
      }
      loaded = true;
    }

    function start() {
      load();
      if (cover) {
        cover.classList.add("is-hidden");
      }
      var action = video.play();
      if (action && typeof action.catch === "function") {
        action.catch(function () {});
      }
    }

    if (cover) {
      cover.addEventListener("click", start);
    }
    if (button) {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        start();
      });
    }
    video.addEventListener("click", function () {
      if (!loaded) {
        start();
      }
    });
    window.addEventListener("pagehide", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  }

  window.initPlayer = initPlayer;
})();
