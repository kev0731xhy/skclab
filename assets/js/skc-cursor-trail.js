(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const hasGsap = typeof window.gsap !== "undefined";

  if (reduceMotion || !finePointer || !hasGsap) {
    return;
  }

  const icons = [
    {
      color: "#fff15a",
      svg: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M6 7.6c0-1.4 1.1-2.5 2.5-2.5h15.7c1 0 1.8.8 1.8 1.8v20.5H9.1A3.1 3.1 0 0 1 6 24.3V7.6Z" fill="#19bfff" stroke="#fff8cf" stroke-width="1.2"/><path d="M9 5.1h15.2c1 0 1.8.8 1.8 1.8v17H9.7A3.7 3.7 0 0 0 6 27.6v-19A3.5 3.5 0 0 1 9 5.1Z" fill="#ffdf42" stroke="#18305f" stroke-width="1.2"/><path d="M10 9.5h11.6M10 13.5h8.3" stroke="#18305f" stroke-width="2.3" stroke-linecap="round"/><path d="M8.8 23.9H26" stroke="#fff7bf" stroke-width="2.2"/></svg>',
    },
    {
      color: "#7ff2ff",
      svg: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M29.2 4.1 4.5 14.3c-1.2.5-1.1 2.2.1 2.6l8.6 2.6 2.7 8.4c.4 1.3 2.1 1.4 2.7.2L29.9 5.4c.4-.9-.2-1.7-.7-1.3Z" fill="#28d8ff" stroke="#f5ffff" stroke-width="1.4"/><path d="m13.2 19.5 11-10.8-7 15.7-1.9-6.1Z" fill="#075bff"/><path d="m5.4 15.4 18.8-7.7-11 11.8Z" fill="#eaffff" opacity=".98"/></svg>',
    },
    {
      color: "#f8ffff",
      svg: '<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="7" y="9.5" width="18" height="15" rx="4" fill="#f7fbff" stroke="#15d3df" stroke-width="1.5"/><path d="M11 9.5V5.8M21 9.5V5.8" stroke="#16cbd8" stroke-width="2.7" stroke-linecap="round"/><circle cx="12.6" cy="16.5" r="2.2" fill="#18305f"/><circle cx="19.4" cy="16.5" r="2.2" fill="#18305f"/><path d="M13 21h6" stroke="#ff7800" stroke-width="2.6" stroke-linecap="round"/><path d="M5 15h2M25 15h2" stroke="#f7fbff" stroke-width="2.4" stroke-linecap="round"/></svg>',
    },
    {
      color: "#ff7bc8",
      svg: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16.2 27.5c-5-4.2-7.6-8.3-7.6-12.1 0-4 2.9-7.3 6.8-7.9.9-2.7 2.9-4.5 5.3-5.2 1 2.7.7 5.2-.7 7.4 2.8 2 3.8 5.7 2.3 9.1-1.2 3-3.4 5.8-6.1 8.7Z" fill="#ff7abc" stroke="#fff0fb" stroke-width="1.3"/><path d="M15.8 25.1c1.2-5.8 2.6-10.8 4.2-15" stroke="#ffffff" stroke-width="2.3" stroke-linecap="round"/></svg>',
    },
    {
      color: "#6dffd7",
      svg: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 5.4c3.2 2.4 4.8 5 4.8 7.9 0 3.5-2.1 6.6-4.8 9-2.7-2.4-4.8-5.5-4.8-9 0-2.9 1.6-5.5 4.8-7.9Z" fill="#13dd8d" stroke="#effff9" stroke-width="1.4"/><path d="M10.8 20.4 6.4 25M21.2 20.4l4.4 4.6M13.2 27h5.6" stroke="#eaffff" stroke-width="2.6" stroke-linecap="round"/><circle cx="16" cy="12.4" r="2.5" fill="#fff36b"/></svg>',
    },
    {
      color: "#ffb000",
      svg: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="m16 3.8 3.4 7.1 7.8 1-5.8 5.4 1.5 7.7-6.9-3.9L9.1 25l1.5-7.7-5.8-5.4 7.8-1L16 3.8Z" fill="#ffdd37" stroke="#fff7a8" stroke-width="1.4"/><path d="m16 8.6 2 4.1 4.5.6-3.3 3.1.9 4.5-4.1-2.3-4.1 2.3.9-4.5-3.3-3.1 4.5-.6 2-4.1Z" fill="#fff078"/></svg>',
    },
  ];

  const body = document.body;
  const cursor = document.createElement("span");
  cursor.className = "skc-cursor-game";
  cursor.innerHTML = `
    <svg viewBox="0 0 72 72" aria-hidden="true">
      <defs>
        <linearGradient id="skcGameCursorFill" x1="13" y1="9" x2="55" y2="64" gradientUnits="userSpaceOnUse">
          <stop stop-color="#5CFFE4"/>
          <stop offset=".28" stop-color="#1DD7C5"/>
          <stop offset=".5" stop-color="#FF9B20"/>
          <stop offset="1" stop-color="#F05A00"/>
        </linearGradient>
        <linearGradient id="skcGameCursorSide" x1="32" y1="34" x2="54" y2="62" gradientUnits="userSpaceOnUse">
          <stop stop-color="#0A9EB8"/>
          <stop offset=".46" stop-color="#D65300"/>
          <stop offset="1" stop-color="#651B00"/>
        </linearGradient>
        <linearGradient id="skcGameCursorEdge" x1="10" y1="8" x2="58" y2="64" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FFFFFF"/>
          <stop offset=".45" stop-color="#E9FFFF"/>
          <stop offset=".76" stop-color="#FFE6C2"/>
          <stop offset="1" stop-color="#FFC46A"/>
        </linearGradient>
      </defs>
      <path d="M10.5 7.7c-2.4-1.3-5.2.8-4.6 3.5L18 63.4c.7 3 4.7 3.7 6.4 1.1l7.7-11.8 8.8 13.2c1.3 2 4.1 2.5 6.1 1.1l5.3-3.6c2-1.4 2.5-4.1 1.1-6.1l-8.6-12.9 14.4-1.8c3.1-.4 4.1-4.4 1.5-6.1L10.5 7.7Z" fill="url(#skcGameCursorEdge)"/>
      <path d="M13.5 14.3 23.8 58l7.2-11c1.2-1.9 4-2 5.3-.1l8.8 13.2 4.8-3.2-8.7-13c-1.2-1.8-.1-4.3 2.1-4.6l13.2-1.6-43-23.4Z" fill="url(#skcGameCursorFill)"/>
      <path d="M31 47c1.2-1.9 4-2 5.3-.1l8.8 13.2 4.8-3.2-8.7-13c-1.2-1.8-.1-4.3 2.1-4.6l13.2-1.6-21.6 3.2L31 47Z" fill="url(#skcGameCursorSide)" opacity=".9"/>
      <path d="M16.8 17.7 24 48.6l4.7-7.2" fill="none" stroke="rgba(255,255,255,.7)" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M18.2 17.1c10.4 4.9 20.9 10.7 31.5 17.3" fill="none" stroke="rgba(255,255,255,.38)" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M12.9 13.6 56.5 37.7" fill="none" stroke="rgba(8,43,120,.2)" stroke-width="1.3" stroke-linecap="round"/>
    </svg>
  `;
  body.append(cursor);
  body.classList.add("skc-custom-cursor");

  gsap.set(cursor, { xPercent: -14, yPercent: -10 });
  const xCursor = gsap.quickTo(cursor, "x", { duration: 0.1, ease: "power3.out" });
  const yCursor = gsap.quickTo(cursor, "y", { duration: 0.1, ease: "power3.out" });

  let lastX = 0;
  let lastY = 0;
  let lastSpawnX = 0;
  let lastSpawnY = 0;
  let lastSpawnAt = 0;
  let activeCount = 0;
  const maxSparks = 30;

  const interactiveSelector = "a, button, input, textarea, select, [role='button'], .nav-item";

  const spawnSpark = (x, y, dx, dy) => {
    if (activeCount >= maxSparks) return;
    activeCount += 1;

    const icon = icons[Math.floor(Math.random() * icons.length)];
    const spark = document.createElement("span");
    spark.className = "skc-cursor-spark";
    spark.style.setProperty("--spark-color", icon.color);
    spark.innerHTML = icon.svg;
    body.appendChild(spark);

    const driftX = gsap.utils.clamp(-54, 54, dx * 0.5 + gsap.utils.random(-28, 28));
    const dropY = gsap.utils.random(48, 104);
    const size = gsap.utils.random(1, 1.2);

    gsap.set(spark, {
      x,
      y,
      scale: size,
      rotation: gsap.utils.random(-24, 24),
      autoAlpha: 0,
    });

    gsap.timeline({
      onComplete: () => {
        spark.remove();
        activeCount -= 1;
      },
    })
      .to(spark, {
        autoAlpha: 1,
        duration: 0.16,
        ease: "power2.out",
      })
      .to(spark, {
        autoAlpha: 1,
        duration: gsap.utils.random(0.22, 0.34),
        ease: "none",
      })
      .to(spark, {
        x: x + driftX,
        y: y + dropY,
        rotation: `+=${gsap.utils.random(-85, 85)}`,
        scale: 0.72,
        autoAlpha: 0,
        duration: gsap.utils.random(1.35, 1.85),
        ease: "power2.out",
      }, 0.16);
  };

  const onMove = (event) => {
    const x = event.clientX;
    const y = event.clientY;
    xCursor(x);
    yCursor(y);

    const dx = x - lastX;
    const dy = y - lastY;
    const speed = Math.hypot(dx, dy);
    const distFromSpawn = Math.hypot(x - lastSpawnX, y - lastSpawnY);
    const now = performance.now();
    const spawnDelay = speed > 28 ? 58 : 86;
    const spawnDistance = speed > 28 ? 26 : 38;
    if (distFromSpawn > spawnDistance && now - lastSpawnAt > spawnDelay) {
      spawnSpark(x - dx * 0.28, y - dy * 0.28, dx, dy);
      lastSpawnX = x;
      lastSpawnY = y;
      lastSpawnAt = now;
    }

    lastX = x;
    lastY = y;
  };

  const onOver = (event) => {
    const target = event.target;
    if (target instanceof Element && target.closest(interactiveSelector)) {
      body.classList.add("skc-cursor-hover");
      gsap.to(cursor, { scale: 1.08, rotation: -3, duration: 0.22, ease: "power3.out" });
    }
  };

  const onOut = (event) => {
    const target = event.target;
    if (target instanceof Element && target.closest(interactiveSelector)) {
      body.classList.remove("skc-cursor-hover");
      gsap.to(cursor, { scale: 1, rotation: 0, duration: 0.24, ease: "power3.out" });
    }
  };

  const onDown = () => {
    gsap.to(cursor, { scale: 0.92, y: "+=3", duration: 0.08, ease: "power2.out" });
  };

  const onUp = () => {
    gsap.to(cursor, { scale: body.classList.contains("skc-cursor-hover") ? 1.08 : 1, y: "-=3", duration: 0.16, ease: "power3.out" });
  };

  window.addEventListener("mousemove", onMove, { passive: true });
  window.addEventListener("mousedown", onDown);
  window.addEventListener("mouseup", onUp);
  document.addEventListener("mouseover", onOver);
  document.addEventListener("mouseout", onOut);
})();
