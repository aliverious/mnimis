// js/ui.js

// Dark mode toggle
const toggle = document.getElementById("dark-mode-toggle");
const currentTheme = localStorage.getItem("theme") || "light";
if (currentTheme === "dark") document.body.classList.add("dark");

toggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const theme = document.body.classList.contains("dark") ? "dark" : "light";
  localStorage.setItem("theme", theme);
});

// Language switching
const flags = document.querySelectorAll(".flag");
flags.forEach(flag => {
  flag.addEventListener("click", () => {
    const selectedLang = flag.dataset.lang;
    localStorage.setItem("lang", selectedLang);
    applyTranslations(selectedLang);
  });
});

// Load language on page load
document.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("lang") || "el";
  applyTranslations(savedLang);
});