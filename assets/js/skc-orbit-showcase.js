(function () {
  const section = document.querySelector(".skc-orbit-showcase");
  const stage = section && section.querySelector(".skc-orbit-showcase__stage");
  const arc = section && section.querySelector(".skc-orbit-showcase__arc");
  const cards = arc ? Array.from(arc.querySelectorAll(".skc-orbit-card")) : [];

  if (!section || !stage || !arc || !cards.length) {
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = typeof window.gsap !== "undefined";
  let progress = 0;
  let targetProgress = 0;
  let rafId = 0;
  let isLocked = false;
  let sectionTop = 0;
  let lastProgress = -1;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function metrics() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const mobile = width < 760;
    const visibleCount = Math.min(cards.length, mobile ? 8 : 16);
    const step = 180 / Math.max(1, visibleCount - 1);

    return {
      radiusX: mobile ? width * 0.55 : width * 0.505,
      radiusY: mobile ? height * 0.73 : height * 0.82,
      step,
      travel: Math.max(0, (cards.length - visibleCount) * step),
      edgePad: step * 0.45
    };
  }

  function setCard(card, x, y, rotation, opacity) {
    if (hasGsap) {
      window.gsap.set(card, {
        "--card-x": x + "px",
        "--card-y": y + "px",
        "--card-rotation": rotation + "deg",
        autoAlpha: opacity
      });
      return;
    }

    card.style.setProperty("--card-x", x + "px");
    card.style.setProperty("--card-y", y + "px");
    card.style.setProperty("--card-rotation", rotation + "deg");
    card.style.opacity = String(opacity);
    card.style.visibility = opacity > 0 ? "visible" : "hidden";
  }

  function render(nextProgress) {
    const cfg = metrics();
    const shift = nextProgress * cfg.travel;

    cards.forEach(function (card, index) {
      const angle = index * cfg.step - shift;
      const visible = angle >= -cfg.edgePad && angle <= 180 + cfg.edgePad;
      const displayAngle = clamp(angle, 0, 180);
      const rad = displayAngle * Math.PI / 180;
      const x = Math.cos(rad) * cfg.radiusX;
      const y = -Math.sin(rad) * cfg.radiusY;
      const edgeDistance = Math.min(angle + cfg.edgePad, 180 + cfg.edgePad - angle);
      const opacity = visible ? clamp(edgeDistance / cfg.edgePad, 0, 1) : 0;

      setCard(card, x, y, 90 - displayAngle, opacity);
    });
  }

  function update(nextProgress) {
    const value = prefersReducedMotion ? 0 : clamp(nextProgress, 0, 1);
    if (Math.abs(value - lastProgress) < 0.0005) {
      return;
    }
    lastProgress = value;
    render(value);
  }

  function animateToTarget() {
    rafId = 0;
    const diff = targetProgress - progress;

    if (Math.abs(diff) < 0.0008) {
      progress = targetProgress;
      update(progress);
      return;
    }

    progress += diff * 0.13;
    update(progress);
    rafId = requestAnimationFrame(animateToTarget);
  }

  function requestProgress(nextProgress) {
    targetProgress = clamp(nextProgress, 0, 1);
    if (!rafId) {
      rafId = requestAnimationFrame(animateToTarget);
    }
  }

  function measure() {
    sectionTop = section.getBoundingClientRect().top + window.scrollY;
    lastProgress = -1;
    targetProgress = progress;
    update(progress);
  }

  function lock() {
    if (isLocked) return;
    isLocked = true;
    sectionTop = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: sectionTop, behavior: "auto" });
    section.classList.add("is-wheel-locked");
  }

  function unlock() {
    if (!isLocked) return;
    isLocked = false;
    section.classList.remove("is-wheel-locked");
  }

  function shouldStartLock(direction, delta) {
    const rect = section.getBoundingClientRect();
    const crossingDistance = Math.max(2, Math.abs(delta) + 4);
    const atPinnedPosition = rect.top <= crossingDistance && rect.bottom > window.innerHeight * 0.35;
    const returningFromBelow = rect.top < window.innerHeight * 0.65 && rect.bottom >= window.innerHeight - crossingDistance;

    if (direction > 0) {
      return atPinnedPosition && targetProgress < 0.999;
    }
    return returningFromBelow && targetProgress > 0.001;
  }

  function onWheel(event) {
    const direction = Math.sign(event.deltaY || 0);
    if (!direction || prefersReducedMotion) return;

    if (!isLocked) {
      if (!shouldStartLock(direction, event.deltaY)) return;
      lock();
    }

    const atStart = targetProgress <= 0.001;
    const atEnd = targetProgress >= 0.999;
    if ((direction < 0 && atStart) || (direction > 0 && atEnd)) {
      unlock();
      return;
    }

    event.preventDefault();
    const speed = window.matchMedia("(max-width: 760px)").matches ? 4600 : 6200;
    const normalizedDelta = clamp(event.deltaY, -110, 110);
    requestProgress(targetProgress + normalizedDelta / speed);
  }

  function onScroll() {
    if (isLocked && Math.abs(window.scrollY - sectionTop) > 1) {
      window.scrollTo({ top: sectionTop, behavior: "auto" });
    }
  }

  update(0);
  measure();
  window.addEventListener("load", measure, { once: true });
  window.addEventListener("resize", measure, { passive: true });
  window.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("scroll", onScroll, { passive: true });
})();
