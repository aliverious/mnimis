// js/ui.js
// UI helper functions

/**
 * Show a loading overlay
 */
export function showLoader() {
  let loader = document.getElementById('loader-overlay');
  if (!loader) {
    loader = document.createElement('div');
    loader.id = 'loader-overlay';
    loader.style.position = 'fixed';
    loader.style.top = '0';
    loader.style.left = '0';
    loader.style.width = '100%';
    loader.style.height = '100%';
    loader.style.background = 'rgba(0, 0, 0, 0.5)';
    loader.style.display = 'flex';
    loader.style.justifyContent = 'center';
    loader.style.alignItems = 'center';
    loader.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(loader);
  }
  loader.style.display = 'flex';
}

/**
 * Hide the loading overlay
 */
export function hideLoader() {
  const loader = document.getElementById('loader-overlay');
  if (loader) loader.style.display = 'none';
}

/**
 * Display a temporary alert
 * @param {string} message – Το μήνυμα που εμφανίζεται
 * @param {string} type – 'info' | 'error' | 'success'
 */
export function displayAlert(message, type = 'info') {
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.textContent = message;
  Object.assign(alert.style, {
    position: 'fixed',
    top: '1rem',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.375rem',
    backgroundColor: type === 'error' ? '#ff4d4f' : (type === 'success' ? '#52c41a' : '#0055A5'),
    color: '#fff',
    zIndex: 1000,
    fontFamily: 'Roboto, sans-serif',
    fontSize: '1rem',
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
  });
  document.body.appendChild(alert);
  setTimeout(() => alert.remove(), 3000);
}

/**
 * Generate a QR code inside a container
 * @param {string} containerId – Το id του element όπου θα μπεί το QR
 * @param {string} text – Το κείμενο/URL που κωδικοποιείται
 */
export async function generateQRCode(containerId, text) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  // Υποθέτουμε ότι έχουμε φορτώσει ήδη τη βιβλιοθήκη QRCode.js
  new QRCode(container, {
    text,
    width: 128,
    height: 128
  });
}

// Dark mode persistence on load
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  document.documentElement.setAttribute('data-theme', savedTheme);
}

/**
 * Toggle dark mode
 */
export function toggleDarkMode() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
}

/**
 * Sanitize input with DOMPurify
 * @param {string} input – Το ακατέργαστο HTML/text
 * @returns {string} – Το καθαρισμένο
 */
// Υποθέτουμε ότι η βιβλιοθήκη DOMPurify είναι φορτωμένη global
export function sanitize(input) {
  return DOMPurify.sanitize(input);
}
