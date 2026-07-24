(function () {
  const root = document.querySelector(".skc-lab-cube");

  if (!root) {
    return;
  }

  const scene = root.querySelector(".skc-lab-cube__scene");
  const faces = Array.from(root.querySelectorAll(".skc-lab-cube__face"));
  const buttons = Array.from(root.querySelectorAll(".skc-lab-cube__nav-button"));
  const step = 360 / Math.max(faces.length, 1);
  let activeIndex = 0;

  const setActive = (index) => {
    activeIndex = Number(index);
    scene.style.setProperty("--cube-rotation", `${activeIndex * -step}deg`);
    scene.dataset.activeLab = String(activeIndex);

    faces.forEach((face, faceIndex) => {
      const isActive = faceIndex === activeIndex;
      face.classList.toggle("is-active", isActive);
      face.setAttribute("aria-hidden", isActive ? "false" : "true");
      face.tabIndex = isActive ? 0 : -1;
    });

    buttons.forEach((button, buttonIndex) => {
      const isActive = buttonIndex === activeIndex;
      button.classList.toggle("is-active", isActive);
      if (isActive) {
        button.setAttribute("aria-current", "true");
      } else {
        button.removeAttribute("aria-current");
      }
    });
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      setActive(button.dataset.labIndex);
    });
  });

  root.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
      return;
    }

    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (activeIndex + direction + faces.length) % faces.length;
    setActive(nextIndex);
    buttons[nextIndex].focus();
  });

  setActive(0);
})();
