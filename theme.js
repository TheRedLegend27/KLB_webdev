(function () {
  var stored = localStorage.getItem("theme");
  var theme = stored !== null ? stored : "dark";
  document.documentElement.setAttribute("main-theme", theme);
})();

document.addEventListener("DOMContentLoaded", function () {
  var btn = document.getElementById("theme-toggle");
  if (!btn) return;

  var current = document.documentElement.getAttribute("main-theme");
  btn.textContent = current === "dark" ? "Light Mode" : "Dark Mode";

  btn.addEventListener("click", function () {
    current = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("main-theme", current);
    localStorage.setItem("theme", current);
    btn.textContent = current === "dark" ? "Light Mode" : "Dark Mode";
  });
});
