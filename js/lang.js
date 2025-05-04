// lang.js
const translations = {
  el: {
    site_title: "MNIMIS.GR",
    home_title: "Ψηφιακές Σελίδες Μνήμης",
    home_description: "Δημιουργούμε χώρο για τη μνήμη των αγαπημένων σας. Με τη χρήση τεχνολογιών QR/NFC, προσφέρουμε μοναδικές ψηφιακές σελίδες μνήμης που περιλαμβάνουν φωτογραφίες, βίντεο, σχόλια και μουσική.",
    get_started: "Ξεκίνα",
    login_button: "Είσοδος",
    search_memorial: "Αναζήτηση Memorial",
    search: "Αναζήτηση",
    dashboard_title: "Πίνακας Χρήστη",
    welcome_relative: "Καλώς ήρθατε, Συγγενή",
    welcome_partner: "Καλώς ήρθατε, Συνεργάτη",
    relative_info: "Εδώ μπορείτε να διαχειριστείτε τις σελίδες μνήμης που δημιουργήσατε.",
    partner_info: "Ως γραφείο τελετών, μπορείτε να προσθέσετε memorial για λογαριασμό συγγενών.",
    create_memorial: "➕ Δημιουργία Memorial",
    add_partner_memorial: "➕ Προσθήκη Memorial",
    memorial_page: "Σελίδα Μνήμης",
    comments: "Σχόλια/Ευχές",
    submit_comment: "Υποβολή",
    report_memorial: "Αναφορά Memorial"
  },
  en: {
    site_title: "MNIMIS.GR",
    home_title: "Digital Memorial Pages",
    home_description: "We create space to honor your loved ones. Using QR/NFC technology, we provide unique digital memorial pages with photos, videos, comments, and music.",
    get_started: "Get Started",
    login_button: "Login",
    search_memorial: "Search Memorial",
    search: "Search",
    dashboard_title: "User Dashboard",
    welcome_relative: "Welcome, Relative",
    welcome_partner: "Welcome, Partner",
    relative_info: "Here you can manage your created memorial pages.",
    partner_info: "As a funeral home, you can add memorials on behalf of relatives.",
    create_memorial: "➕ Create Memorial",
    add_partner_memorial: "➕ Add Memorial",
    memorial_page: "Memorial Page",
    comments: "Comments/Wishes",
    submit_comment: "Submit",
    report_memorial: "Report Memorial"
  },
  bg: {
    site_title: "MNIMIS.GR",
    home_title: "Цифрови Мемориални Страници",
    home_description: "Създаваме пространство за паметта на вашите близки. С помощта на QR/NFC технология предоставяме уникални мемориални страници със снимки, видео, коментари и музика.",
    get_started: "Започнете",
    login_button: "Вход",
    search_memorial: "Търсене на Мемориал",
    search: "Търси",
    dashboard_title: "Панел на Потребителя",
    welcome_relative: "Добре дошли, Роднина",
    welcome_partner: "Добре дошли, Партньоре",
    relative_info: "Тук можете да управлявате вашите мемориални страници.",
    partner_info: "Като погребално бюро, можете да добавяте мемориали от името на роднини.",
    create_memorial: "➕ Създай Мемориал",
    add_partner_memorial: "➕ Добави Мемориал",
    memorial_page: "Мемориална Страница",
    comments: "Коментари/Пожелания",
    submit_comment: "Изпрати",
    report_memorial: "Докладвай Мемориал"
  },
  ru: {
    site_title: "MNIMIS.GR",
    home_title: "Цифровые Мемориальные Страницы",
    home_description: "Мы создаем пространство для памяти ваших близких. С помощью технологий QR/NFC мы предоставляем уникальные мемориальные страницы с фотографиями, видео, комментариями и музыкой.",
    get_started: "Начать",
    login_button: "Вход",
    search_memorial: "Поиск Мемориала",
    search: "Поиск",
    dashboard_title: "Панель Пользователя",
    welcome_relative: "Добро пожаловать, Родственник",
    welcome_partner: "Добро пожаловать, Партнёр",
    relative_info: "Здесь вы можете управлять созданными мемориалами.",
    partner_info: "Как похоронное бюро, вы можете добавлять мемориалы от имени родственников.",
    create_memorial: "➕ Создать Мемориал",
    add_partner_memorial: "➕ Добавить Мемориал",
    memorial_page: "Мемориальная Страница",
    comments: "Комментарии/Пожелания",
    submit_comment: "Отправить",
    report_memorial: "Пожаловаться на Мемориал"
  },
  al: {
    site_title: "MNIMIS.GR",
    home_title: "Faqet Memoriale Digjitale",
    home_description: "Krijojmë një hapësirë për kujtimin e të dashurve tuaj. Me teknologjinë QR/NFC ofrojmë faqe memoriale unike me foto, video, komente dhe muzikë.",
    get_started: "Fillo",
    login_button: "Hyr",
    search_memorial: "Kërko Memorial",
    search: "Kërko",
    dashboard_title: "Paneli i Përdoruesit",
    welcome_relative: "Mirë se vini, I afërm",
    welcome_partner: "Mirë se vini, Partner",
    relative_info: "Këtu mund të menaxhoni memorialet që keni krijuar.",
    partner_info: "Si zyrë funerale, mund të shtoni memoriale në emër të të afërmve.",
    create_memorial: "➕ Krijo Memorial",
    add_partner_memorial: "➕ Shto Memorial",
    memorial_page: "Faqe Memoriale",
    comments: "Komente/Urime",
    submit_comment: "Dërgo",
    report_memorial: "Raporto Memorial"
  }
};

// Ορισμός γλώσσας και μετάφραση όλων των στοιχείων
function applyTranslations(lang) {
  const elements = document.querySelectorAll("[data-lang-key]");
  elements.forEach(el => {
    const key = el.getAttribute("data-lang-key");
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
  localStorage.setItem("lang", lang);
}

// Φόρτωση αποθηκευμένης γλώσσας
document.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("lang") || "el";
  applyTranslations(savedLang);

  document.querySelectorAll(".flag").forEach(flag => {
    flag.addEventListener("click", () => {
      const selected = flag.getAttribute("data-lang");
      applyTranslations(selected);
    });
  });
});
