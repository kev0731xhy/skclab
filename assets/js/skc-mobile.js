(function () {
  const mobileQuery = window.matchMedia("(max-width: 767px)");
  const isMobile = () => mobileQuery.matches;

  const text = {
    activities: "\u6d3b\u52a8\u4e0e\u6bd4\u8d5b",
    labs: "\u4e03\u5927\u5b9e\u9a8c\u5ba4",
    school: "\u5b66\u6821\u5408\u4f5c",
    contact: "\u8054\u7cfb\u6211\u4eec",
    douyin: "\u6296\u97f3",
    xhs: "\u5c0f\u7ea2\u4e66",
    close: "\u5173\u95ed\u5bfc\u822a",
    nav: "\u79fb\u52a8\u7aef\u5bfc\u822a"
  };

  function getOrCreateMobileTrigger() {
    let trigger = document.querySelector(".js-header-trigger");
    if (trigger) {
      trigger.classList.add("skc-mobile-menu-trigger");
      return trigger;
    }

    const host = document.querySelector(".header__right") || document.querySelector(".header");
    if (!host) return null;

    trigger = document.createElement("button");
    trigger.className = "header__trigger js-header-trigger skc-mobile-menu-trigger";
    trigger.type = "button";
    trigger.setAttribute("aria-label", "\u6253\u5f00\u5bfc\u822a");
    trigger.innerHTML =
      '<span class="sr-only">Toggle navigatie</span>' +
      '<div class="hamburger"><span></span><span></span><span></span></div>';
    host.appendChild(trigger);
    return trigger;
  }

  function buildMobileMenu() {
    const trigger = getOrCreateMobileTrigger();
    if (!trigger || document.querySelector(".skc-mobile-menu")) return;

    const links = [
      [text.activities, "activities-competitions.html"],
      [text.labs, "labs.html"],
      [text.school, "school-cooperation.html"],
      [text.contact, "about.html"]
    ];

    const socials = [
      {
        label: text.douyin,
        href: "https://www.douyin.com/user/MS4wLjABAAAAGWfiB60nVIQFbsUqtux2q3cs2xWfgdi76LtvRcpfYMFD9UW_tpyhJWzi20uoCTcE?from_tab_name=main",
        img: "assets/skc/social-icons/douyin.png",
        fallback: "\u6296"
      },
      {
        label: text.xhs,
        href: "https://www.xiaohongshu.com/user/profile/63d9d6860000000027029035?xsec_token=ABFRNiBrxH1arr4BXJJlc8cRs336c12gG-v9EobyZbe0M%3D&xsec_source=pc_search",
        img: "assets/skc/social-icons/xiaohongshu.png",
        fallback: "\u7ea2"
      }
    ];

    const menu = document.createElement("nav");
    menu.className = "skc-mobile-menu";
    menu.setAttribute("aria-label", text.nav);
    menu.innerHTML = `
      <div class="skc-mobile-menu__panel">
        <div class="skc-mobile-menu__brand">
          <a class="skc-mobile-menu__brand-link" href="index.html" aria-label="SKC home">
            <img src="assets/skc/logos/skc-logo-header-white-cropped.png" alt="SKC">
          </a>
          <button class="skc-mobile-menu__close" type="button" aria-label="${text.close}">&times;</button>
        </div>
        <div class="skc-mobile-menu__links">
          ${links.map(([label, href]) => `<a class="skc-mobile-menu__link" href="${href}">${label}</a>`).join("")}
        </div>
        <div class="skc-mobile-menu__socials">
          ${socials.map((item) => `<a class="skc-mobile-menu__social" href="${item.href}" target="_blank" rel="noopener" aria-label="${item.label}"><img src="${item.img}" alt=""><span>${item.fallback}</span></a>`).join("")}
        </div>
      </div>
    `;

    document.body.appendChild(menu);
    trigger.setAttribute("aria-expanded", "false");

    const close = menu.querySelector(".skc-mobile-menu__close");
    const setOpen = (open) => {
      document.body.classList.toggle("skc-mobile-menu-open", open);
      menu.classList.toggle("is-open", open);
      trigger.setAttribute("aria-expanded", open ? "true" : "false");
    };

    trigger.addEventListener("click", (event) => {
      if (!isMobile()) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      setOpen(!menu.classList.contains("is-open"));
    }, true);

    close.addEventListener("click", () => setOpen(false));
    menu.addEventListener("click", (event) => {
      if (event.target === menu || event.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setOpen(false);
    });
  }

  function runMobileEntry() {
    const loader = document.querySelector(".skc-entry-animation");
    if (!loader) return;

    const video = loader.querySelector(".skc-entry-animation__video");
    const steps = Array.from(loader.querySelectorAll("[data-skc-entry-step]"));

    if (!isMobile()) {
      loader.classList.remove("skc-entry-animation--mobile");
      return;
    }

    loader.classList.add("skc-entry-animation--mobile");
    if (video) {
      video.pause();
      video.removeAttribute("src");
      video.load();
    }

    if (!steps.length || loader.dataset.mobileEntryStarted === "true") return;
    loader.dataset.mobileEntryStarted = "true";
    loader.classList.remove("is-done");
    document.body.classList.add("skc-entry-is-running");

    let index = 0;
    const show = () => {
      steps.forEach((step, stepIndex) => {
        step.classList.toggle("is-active", stepIndex === index);
      });
      index += 1;
      if (index < steps.length) {
        window.setTimeout(show, 520);
      } else {
        window.setTimeout(() => {
          loader.classList.add("is-done");
          steps.forEach((step) => step.classList.remove("is-active"));
          document.body.classList.remove("skc-entry-is-running");
          document.body.classList.add("skc-entry-is-complete");
          window.setTimeout(() => loader.remove(), 520);
        }, 580);
      }
    };
    show();
  }

  function flagMobile() {
    document.documentElement.classList.toggle("skc-is-mobile", isMobile());
  }

  buildMobileMenu();
  flagMobile();
  runMobileEntry();
  mobileQuery.addEventListener("change", () => {
    flagMobile();
    runMobileEntry();
  });
})();
