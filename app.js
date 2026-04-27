const navButtons = document.querySelectorAll("[data-view]");
const views = document.querySelectorAll(".view");
const themeToggle = document.getElementById("themeToggle");

function openView(id) {
  views.forEach(view => view.classList.toggle("active", view.id === id));

  document.querySelectorAll(".bottom-nav [data-view]").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.view === id);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

navButtons.forEach(button => {
  button.addEventListener("click", () => openView(button.dataset.view));
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  const isLight = document.body.classList.contains("light");
  themeToggle.querySelector("span").textContent = isLight ? "🌙" : "☀️";
  localStorage.setItem("kstudio-theme", isLight ? "light" : "dark");
});

if (localStorage.getItem("kstudio-theme") === "light") {
  document.body.classList.add("light");
  themeToggle.querySelector("span").textContent = "🌙";
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}
