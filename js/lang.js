
const translations = {
  el: {
    site_title: "MNIMIS.GR",
    home_title: "Ψηφιακές Σελίδες Μνήμης",
    home_description: "Στιγμές που κρατούνται ζωντανές. Δημιουργήστε έναν ψηφιακό χώρο μνήμης για εκείνους που αγαπήσατε, με φωτογραφίες, μουσική, βίντεο και ευχές. Το MNIMIS.GR προσφέρει έναν αξιοπρεπή τρόπο να θυμόμαστε — με τεχνολογία QR και NFC.",
    get_started: "Δημιουργία Memorial"
  },
  en: {
    site_title: "MNIMIS.GR",
    home_title: "Digital Memorial Pages",
    home_description: "Moments that stay alive. Create a digital memorial space for your loved ones with photos, music, videos and wishes. MNIMIS.GR offers a respectful way to remember — with QR and NFC technology.",
    get_started: "Create Memorial"
  },
  bg: {
    site_title: "MNIMIS.GR",
    home_title: "Дигитални Мемориални Страници",
    home_description: "Моменти, които остават живи. Създайте дигитално място за спомен за вашите близки с снимки, музика, видеа и пожелания. MNIMIS.GR предлага достоен начин за спомняне — с QR и NFC технологии.",
    get_started: "Създай Мемориал"
  },
  ru: {
    site_title: "MNIMIS.GR",
    home_title: "Цифровые Мемориальные Страницы",
    home_description: "Моменты, которые остаются живыми. Создайте цифровое мемориальное пространство для своих близких с фотографиями, музыкой, видео и пожеланиями. MNIMIS.GR предлагает достойный способ помнить — с технологией QR и NFC.",
    get_started: "Создать Мемориал"
  },
  al: {
    site_title: "MNIMIS.GR",
    home_title: "Faqe Memoriale Dixhitale",
    home_description: "Momente që mbeten të gjalla. Krijoni një hapësirë dixhitale përkujtimore për të dashurit tuaj me foto, muzikë, video dhe urime. MNIMIS.GR ofron një mënyrë të denjë për të kujtuar — me teknologjinë QR dhe NFC.",
    get_started: "Krijo Memorial"
  }
};

let currentLang = localStorage.getItem('lang') || 'el';

function applyTranslations() {
  document.querySelectorAll('[data-lang-key]').forEach(el => {
    const key = el.getAttribute('data-lang-key');
    const translation = translations[currentLang][key];
    if (translation) {
      if (['INPUT', 'TEXTAREA'].includes(el.tagName)) {
        el.placeholder = translation;
      } else {
        el.textContent = translation;
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', applyTranslations);

document.querySelectorAll('.flag').forEach(flag => {
  flag.addEventListener('click', () => {
    const lang = flag.getAttribute('data-lang');
    currentLang = lang;
    localStorage.setItem('lang', lang);
    applyTranslations();
  });
});
