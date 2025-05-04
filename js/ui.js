// ui.js
document.addEventListener("DOMContentLoaded", () => {
  const html = document.documentElement;
  const darkToggle = document.getElementById("dark-mode-toggle");

  // Έλεγχος για αποθηκευμένη προτίμηση
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    html.setAttribute("data-theme", "dark");
  }

  if (darkToggle) {
    darkToggle.addEventListener("click", () => {
      const isDark = html.getAttribute("data-theme") === "dark";
      if (isDark) {
        html.removeAttribute("data-theme");
        localStorage.setItem("theme", "light");
      } else {
        html.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
      }
    });
  }
});
