(function () {
  const title = document.querySelector("[data-rolling-text]");

  if (!title) {
    return;
  }

  const text = title.getAttribute("data-rolling-text") || title.textContent.trim();
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = typeof window.gsap !== "undefined";

  if (!text || prefersReducedMotion || !hasGsap) {
    title.textContent = text;
    title.classList.add("skc-rolling-title--static");
    return;
  }

  const chars = Array.from(text);
  title.setAttribute("aria-label", text);
  title.textContent = "";

  const fragment = document.createDocumentFragment();

  chars.forEach((char, index) => {
    const shell = document.createElement("span");
    shell.className = "skc-rolling-title__char";
    shell.style.setProperty("--char-index", index);
    shell.setAttribute("aria-hidden", "true");

    const front = document.createElement("span");
    front.className = "skc-rolling-title__face skc-rolling-title__face--front";
    front.textContent = char;

    const back = document.createElement("span");
    back.className = "skc-rolling-title__face skc-rolling-title__face--back";
    back.textContent = char;
    back.setAttribute("aria-hidden", "true");

    shell.append(front, back);
    fragment.appendChild(shell);
  });

  title.appendChild(fragment);
  title.classList.add("is-rolling-ready");

  const charEls = title.querySelectorAll(".skc-rolling-title__char");
  let loopCall;
  const timeline = window.gsap.timeline({
    paused: true,
    onComplete: () => {
      loopCall = window.gsap.delayedCall(1.15, () => {
        timeline.restart();
      });
    },
    defaults: {
      duration: 0.82,
      ease: "expo.out"
    }
  });

  window.gsap.set(charEls, {
    transformPerspective: 900,
    transformOrigin: "50% 52%"
  });

  timeline.fromTo(charEls, {
    rotationX: -96,
    yPercent: 64,
    z: -36,
    autoAlpha: 1
  }, {
    rotationX: 0,
    yPercent: 0,
    z: 0,
    autoAlpha: 1,
    immediateRender: false,
    stagger: {
      each: 0.07,
      from: "start"
    }
  });

  timeline.to(charEls, {
    rotationX: 18,
    yPercent: -8,
    z: 20,
    duration: 0.26,
    ease: "power2.out",
    stagger: {
      each: 0.04,
      from: "center"
    }
  }, "-=0.25");

  timeline.to(charEls, {
    rotationX: 0,
    yPercent: 0,
    z: 0,
    duration: 0.42,
    ease: "power3.out",
    stagger: {
      each: 0.025,
      from: "center"
    }
  }, "-=0.05");

  const play = () => {
    if (title.classList.contains("has-rolled")) {
      return;
    }
    title.classList.add("has-rolled");
    if (loopCall) {
      loopCall.kill();
    }
    timeline.restart();
  };

  window.skcRollingTitleTimeline = timeline;

  const isInView = () => {
    const rect = title.getBoundingClientRect();
    const height = window.innerHeight || document.documentElement.clientHeight;
    return rect.top < height * 0.82 && rect.bottom > height * 0.12;
  };

  const checkAndPlay = () => {
    if (isInView()) {
      play();
      window.removeEventListener("scroll", checkAndPlay);
      window.removeEventListener("resize", checkAndPlay);
      window.clearInterval(pollId);
    }
  };

  const pollId = window.setInterval(checkAndPlay, 250);
  window.addEventListener("scroll", checkAndPlay, { passive: true });
  window.addEventListener("resize", checkAndPlay);
  window.setTimeout(checkAndPlay, 80);

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          play();
          observer.disconnect();
        }
      });
    }, {
      threshold: 0.35,
      rootMargin: "0px 0px -12% 0px"
    });

    observer.observe(title);
  }
})();
