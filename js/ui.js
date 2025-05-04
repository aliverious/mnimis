
export function toggleDarkMode() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
}

export function showLoader() {
  if (!document.getElementById('loader-overlay')) {
    const loader = document.createElement('div');
    loader.id = 'loader-overlay';
    loader.style.position = 'fixed';
    loader.style.top = '0';
    loader.style.left = '0';
    loader.style.width = '100%';
    loader.style.height = '100%';
    loader.style.background = 'rgba(0,0,0,0.5)';
    loader.style.display = 'flex';
    loader.style.alignItems = 'center';
    loader.style.justifyContent = 'center';
    loader.style.zIndex = '9999';
    loader.innerHTML = '<div class="spinner" style="border: 6px solid #f3f3f3; border-top: 6px solid #333; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite;"></div>';
    document.body.appendChild(loader);
  } else {
    document.getElementById('loader-overlay').style.display = 'flex';
  }
}

export function hideLoader() {
  const loader = document.getElementById('loader-overlay');
  if (loader) loader.style.display = 'none';
}

export function displayAlert(message, type = 'info') {
  const alert = document.createElement('div');
  alert.className = 'alert';
  alert.style.position = 'fixed';
  alert.style.top = '1rem';
  alert.style.left = '50%';
  alert.style.transform = 'translateX(-50%)';
  alert.style.padding = '0.75rem 1.5rem';
  alert.style.borderRadius = '6px';
  alert.style.fontSize = '1rem';
  alert.style.color = '#fff';
  alert.style.zIndex = '10000';
  alert.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.3)';
  alert.style.fontFamily = 'inherit';

  switch (type) {
    case 'success':
      alert.style.backgroundColor = '#2ecc71';
      break;
    case 'error':
      alert.style.backgroundColor = '#e74c3c';
      break;
    default:
      alert.style.backgroundColor = '#3498db';
  }

  alert.textContent = message;
  document.body.appendChild(alert);
  setTimeout(() => alert.remove(), 3000);
}

// Dark mode toggle on page load
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  const toggleBtn = document.getElementById('dark-mode-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleDarkMode);
  }
});
