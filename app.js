const chips = document.querySelectorAll(".chip");
const views = document.querySelectorAll(".view");
const themeBtn = document.getElementById("themeBtn");

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    const target = chip.dataset.target;

    chips.forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");

    views.forEach((view) => {
      view.classList.toggle("active", view.id === target);
    });
  });
});

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
  const light = document.body.classList.contains("light");
  themeBtn.textContent = light ? "🌙" : "☀️";
  localStorage.setItem("style-app-theme", light ? "light" : "dark");
});

if (localStorage.getItem("style-app-theme") === "light") {
  document.body.classList.add("light");
  themeBtn.textContent = "🌙";
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}
