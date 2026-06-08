function initMoviePlayer(playerId, playbackUrl) {
    var root = document.getElementById(playerId);
    if (!root) {
        return;
    }

    var video = root.querySelector("video");
    var overlay = root.querySelector("[data-play-overlay]");
    var button = root.querySelector("[data-play-button]");
    var hlsInstance = null;
    var started = false;

    function hideOverlay() {
        if (overlay) {
            overlay.classList.add("is-hidden");
        }
    }

    function showOverlay() {
        if (overlay) {
            overlay.classList.remove("is-hidden");
        }
    }

    function playVideo() {
        hideOverlay();
        var promise = video.play();
        if (promise && typeof promise.catch === "function") {
            promise.catch(function () {
                showOverlay();
            });
        }
    }

    function start() {
        if (!video || !playbackUrl) {
            return;
        }

        if (started) {
            playVideo();
            return;
        }

        started = true;

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = playbackUrl;
            playVideo();
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls();
            hlsInstance.loadSource(playbackUrl);
            hlsInstance.attachMedia(video);
            hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
                playVideo();
            });
            hlsInstance.on(window.Hls.Events.ERROR, function (eventName, data) {
                if (data && data.fatal && hlsInstance) {
                    hlsInstance.destroy();
                    hlsInstance = null;
                    started = false;
                    showOverlay();
                }
            });
            return;
        }

        video.src = playbackUrl;
        playVideo();
    }

    if (overlay) {
        overlay.addEventListener("click", start);
    }

    if (button) {
        button.addEventListener("click", function (event) {
            event.stopPropagation();
            start();
        });
    }

    if (video) {
        video.addEventListener("click", function () {
            if (video.paused) {
                playVideo();
            } else {
                video.pause();
            }
        });
        video.addEventListener("play", hideOverlay);
    }
}
