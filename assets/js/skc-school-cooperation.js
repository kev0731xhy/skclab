(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = typeof window.gsap !== 'undefined';

  if (!hasGsap || reduceMotion) {
    return;
  }

  const revealItems = document.querySelectorAll('[data-school-reveal]');
  revealItems.forEach((item) => {
    gsap.fromTo(item,
      { autoAlpha: 0, y: 56, scale: 0.985 },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.9,
        ease: 'power3.out',
      }
    );
  });

  const gallery = document.querySelector('[data-school-horizontal-gallery]');
  const sticky = gallery ? gallery.querySelector('.skc-school-gallery__sticky') : null;
  const track = document.querySelector('[data-school-gallery-track]');
  if (!gallery || !sticky || !track || window.matchMedia('(max-width: 900px)').matches) return;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const setX = gsap.quickSetter(track, 'x', 'px');

  let galleryTop = 0;
  let maxShift = 0;
  let progress = 0;
  let isLocked = false;

  const measure = () => {
    const sidePadding = window.innerWidth * 0.1;
    maxShift = Math.max(0, track.scrollWidth - window.innerWidth + sidePadding);
    gallery.style.height = `${window.innerHeight}px`;
    galleryTop = gallery.getBoundingClientRect().top + window.scrollY;
    setX(-maxShift * progress);
  };

  const lock = () => {
    if (isLocked || maxShift <= 0) return;
    isLocked = true;
    galleryTop = gallery.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, galleryTop);
    gallery.classList.add('is-wheel-locked');
  };

  const unlock = (direction) => {
    if (!isLocked) return;
    isLocked = false;
    gallery.classList.remove('is-wheel-locked');
    window.scrollTo(0, direction > 0 ? galleryTop + window.innerHeight + 2 : Math.max(0, galleryTop - 2));
  };

  const shouldStartLock = (direction) => {
    const rect = gallery.getBoundingClientRect();
    if (direction > 0) {
      return rect.top <= 2 && rect.bottom > window.innerHeight * 0.35 && progress < 1;
    }
    return rect.top < window.innerHeight * 0.65 && rect.bottom >= window.innerHeight - 2 && progress > 0;
  };

  const onWheel = (event) => {
    const direction = Math.sign(event.deltaY || 0);
    if (!direction) return;

    if (!isLocked) {
      if (!shouldStartLock(direction)) return;
      lock();
    }

    const atStart = progress <= 0.001;
    const atEnd = progress >= 0.999;
    if ((direction < 0 && atStart) || (direction > 0 && atEnd)) {
      unlock(direction);
      return;
    }

    event.preventDefault();
    const speed = Math.max(1200, maxShift * 0.95);
    progress = clamp(progress + event.deltaY / speed, 0, 1);
    setX(-maxShift * progress);
  };

  const onScroll = () => {
    if (isLocked) {
      window.scrollTo(0, galleryTop);
    }
  };

  const refreshSoon = () => window.requestAnimationFrame(measure);

  track.querySelectorAll('img').forEach((img) => {
    if (!img.complete) img.addEventListener('load', refreshSoon, { once: true });
  });

  measure();
  window.addEventListener('load', measure, { once: true });
  window.addEventListener('resize', refreshSoon, { passive: true });
  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('scroll', onScroll, { passive: true });
})();