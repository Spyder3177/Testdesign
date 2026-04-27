const track = document.getElementById("swipeTrack");
const tabs = [...document.querySelectorAll(".tab")];
const navButtons = [...document.querySelectorAll("#bottomNav button")];
const dots = [...document.querySelectorAll("#pageDots button")];
const indicator = document.getElementById("tabIndicator");
const themeToggle = document.getElementById("themeToggle");

let currentIndex = 0;
let startX = 0;
let currentX = 0;
let isDragging = false;
let trackWidth = 0;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function updateIndicator() {
  const tab = tabs[currentIndex];
  if (!tab) return;

  indicator.style.width = `${tab.offsetWidth}px`;
  indicator.style.transform = `translateX(${tab.offsetLeft}px)`;

  tab.scrollIntoView({
    behavior: "smooth",
    inline: "center",
    block: "nearest"
  });
}

function updateUI(index, animate = true) {
  currentIndex = clamp(index, 0, tabs.length - 1);

  if (!animate) track.classList.add("dragging");
  track.style.transform = `translate3d(${-currentIndex * 20}%, 0, 0)`;
  if (!animate) requestAnimationFrame(() => track.classList.remove("dragging"));

  tabs.forEach((tab, i) => tab.classList.toggle("active", i === currentIndex));
  navButtons.forEach((btn, i) => btn.classList.toggle("active", i === currentIndex));
  dots.forEach((dot, i) => dot.classList.toggle("active", i === currentIndex));
  updateIndicator();
}

function goTo(index) {
  updateUI(index, true);
}

tabs.forEach(tab => {
  tab.addEventListener("click", () => goTo(Number(tab.dataset.index)));
});

navButtons.forEach(btn => {
  btn.addEventListener("click", () => goTo(Number(btn.dataset.index)));
});

dots.forEach(dot => {
  dot.addEventListener("click", () => goTo(Number(dot.dataset.index)));
});

track.addEventListener("pointerdown", (e) => {
  if (e.pointerType === "mouse" && e.button !== 0) return;

  isDragging = true;
  startX = e.clientX;
  currentX = startX;
  trackWidth = track.parentElement.offsetWidth;
  track.classList.add("dragging");
  track.setPointerCapture(e.pointerId);
});

track.addEventListener("pointermove", (e) => {
  if (!isDragging) return;

  currentX = e.clientX;
  const diff = currentX - startX;
  const base = -currentIndex * trackWidth;
  const maxPull = trackWidth * 0.28;

  let drag = diff;
  if ((currentIndex === 0 && diff > 0) || (currentIndex === tabs.length - 1 && diff < 0)) {
    drag = Math.sign(diff) * Math.min(Math.abs(diff), maxPull) * 0.35;
  }

  const px = base + drag;
  const percent = (px / trackWidth) * 20;
  track.style.transform = `translate3d(${percent}%, 0, 0)`;
});

track.addEventListener("pointerup", endDrag);
track.addEventListener("pointercancel", endDrag);

function endDrag(e) {
  if (!isDragging) return;

  const diff = currentX - startX;
  const threshold = trackWidth * 0.16;

  track.classList.remove("dragging");

  if (diff < -threshold) {
    goTo(currentIndex + 1);
  } else if (diff > threshold) {
    goTo(currentIndex - 1);
  } else {
    goTo(currentIndex);
  }

  isDragging = false;
}

window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") goTo(currentIndex + 1);
  if (e.key === "ArrowLeft") goTo(currentIndex - 1);
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  const light = document.body.classList.contains("light");
  themeToggle.textContent = light ? "🌙" : "☀️";
  localStorage.setItem("kstudio-v4-theme", light ? "light" : "dark");
});

if (localStorage.getItem("kstudio-v4-theme") === "light") {
  document.body.classList.add("light");
  themeToggle.textContent = "🌙";
}

window.addEventListener("resize", updateIndicator);
window.addEventListener("load", () => updateUI(0, false));
requestAnimationFrame(updateIndicator);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}
