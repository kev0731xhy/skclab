(function () {
  try {
    sessionStorage.setItem("loaderShown", "true");
  } catch (error) {}

  const overlay = document.querySelector(".skc-entry-animation");

  if (!overlay) {
    return;
  }

  const video = overlay.querySelector(".skc-entry-animation__video");
  const body = document.body;
  const PLAYBACK_RATE = 2;
  const OVERLAY_FADE_MS = 920;
  const FALLBACK_MS = 3900;

  body.classList.add("skc-entry-is-running");

  let isFinished = false;
  let fallbackTimer;

  const finish = () => {
    if (isFinished) {
      return;
    }

    isFinished = true;
    window.clearTimeout(fallbackTimer);
    overlay.classList.add("is-soft-fading");
    overlay.classList.add("is-done");
    overlay.style.opacity = "0";
    overlay.style.transition = `opacity ${OVERLAY_FADE_MS}ms cubic-bezier(.16, 1, .3, 1)`;

    window.setTimeout(() => {
      body.classList.remove("skc-entry-is-running");
      body.classList.add("skc-entry-is-complete");
      overlay.remove();
    }, OVERLAY_FADE_MS);
  };

  const startVideo = () => {
    if (!video) {
      finish();
      return;
    }

    video.muted = true;
    video.playsInline = true;
    video.playbackRate = PLAYBACK_RATE;

    fallbackTimer = window.setTimeout(finish, FALLBACK_MS);
    video.addEventListener("ended", finish, { once: true });
    video.addEventListener("error", finish, { once: true });

    const playPromise = video.play();

    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        window.setTimeout(finish, FALLBACK_MS);
      });
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startVideo, { once: true });
  } else {
    startVideo();
  }
})();
