(function () {
  var sections = Array.prototype.slice.call(document.querySelectorAll('.skc-lab-story'));

  if (!sections.length) {
    return;
  }

  function animateSection(section) {
    if (section.classList.contains('skc-lab-story--entered')) {
      return;
    }

    section.classList.add('skc-lab-story--entered');

    if (!window.gsap) {
      section.classList.add('skc-lab-story--no-gsap');
      return;
    }

    var image = section.querySelector('.skc-lab-story__media');
    var imageNode = section.querySelector('.skc-lab-story__media img');
    var pieces = section.querySelectorAll('.skc-lab-story__index, .skc-lab-story__title, .skc-lab-story__text, .skc-lab-story__points li');
    var fromX = section.classList.contains('skc-lab-story--image-left') ? -54 : 54;
    var timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

    timeline
      .fromTo(image, { x: fromX, scale: .96 }, { x: 0, scale: 1, duration: 1.05 }, 0)
      .fromTo(imageNode, { scale: 1.08 }, { scale: 1, duration: 1.25 }, 0)
      .fromTo(pieces, { y: 34 }, { y: 0, duration: .82, stagger: .075 }, .16);
  }

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateSection(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -12% 0px',
      threshold: .22
    });

    sections.forEach(function (section) {
      observer.observe(section);
    });
  } else {
    sections.forEach(animateSection);
  }
})();
