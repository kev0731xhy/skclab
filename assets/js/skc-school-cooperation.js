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
  const track = gallery ? gallery.querySelector('[data-school-gallery-track]') : null;

  if (!gallery || !sticky || !track || window.matchMedia('(max-width: 900px)').matches) {
    return;
  }

  const getShift = () => {
    const sidePadding = window.innerWidth * 0.1;
    return Math.max(0, track.scrollWidth - window.innerWidth + sidePadding);
  };

  if (typeof window.ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

      gsap.to(track, {
        x: () => -getShift(),
        ease: 'none',
        scrollTrigger: {
          trigger: gallery,
          start: 'top top',
          end: () => `+=${Math.max(window.innerHeight * 1.6, getShift() * 1.05)}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.85,
          anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    const refresh = () => ScrollTrigger.refresh();
    track.querySelectorAll('img').forEach((img) => {
      if (!img.complete) img.addEventListener('load', refresh, { once: true });
    });
    window.addEventListener('load', refresh, { once: true });

    return;
  }

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const setX = gsap.quickSetter(track, 'x', 'px');

  let maxShift = 0;
  let progress = 0;

  const measure = () => {
    maxShift = getShift();
    setX(-maxShift * progress);
  };

  const onWheel = (event) => {
    const rect = gallery.getBoundingClientRect();
    const inView = rect.top <= 0 && rect.bottom >= window.innerHeight;
    if (!inView || maxShift <= 0) return;

    const direction = Math.sign(event.deltaY || 0);
    if (!direction) return;

    const atStart = progress <= 0.001;
    const atEnd = progress >= 0.999;
    if ((direction < 0 && atStart) || (direction > 0 && atEnd)) return;

    event.preventDefault();
    progress = clamp(progress + event.deltaY / Math.max(1600, maxShift * 1.25), 0, 1);
    setX(-maxShift * progress);
  };

  measure();
  window.addEventListener('load', measure, { once: true });
  window.addEventListener('resize', () => window.requestAnimationFrame(measure), { passive: true });
  window.addEventListener('wheel', onWheel, { passive: false });
})();
