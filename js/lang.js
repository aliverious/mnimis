
const translations = {
  el: {
    site_title: "MNIMIS.GR",
    home_title: "Ψηφιακές Σελίδες Μνήμης",
    home_description: "Στιγμές που κρατούνται ζωντανές. Δημιουργήστε έναν ψηφιακό χώρο μνήμης για εκείνους που αγαπήσατε, με φωτογραφίες, μουσική, βίντεο και ευχές. Το MNIMIS.GR προσφέρει έναν αξιοπρεπή τρόπο να θυμόμαστε — με τεχνολογία QR και NFC.",
    get_started: "Δημιουργία Memorial",
    register_title: "Εγγραφή Χρήστη",
    first_name: "Όνομα",
    last_name: "Επώνυμο",
    email: "Email",
    password: "Κωδικός",
    confirm_password: "Επιβεβαίωση Κωδικού",
    register_now: "Εγγραφή",
    partner_register_title: "Εγγραφή Συνεργάτη",
    partner_register_msg: "Για να δημιουργήσετε λογαριασμό ως συνεργάτης (γραφείο τελετών), παρακαλούμε επικοινωνήστε μαζί μας για να σας δοθεί μοναδικός Αριθμός Συνεργάτη.",
    contact_us: "☎️ 6946772226\n📧 aliverious@gmail.com",
    back_to_register: "Επιστροφή στην Εγγραφή"
  },
  en: {
    site_title: "MNIMIS.GR",
    home_title: "Digital Memorial Pages",
    home_description: "Moments that stay alive. Create a digital memorial space for your loved ones with photos, music, videos and wishes. MNIMIS.GR offers a respectful way to remember — with QR and NFC technology.",
    get_started: "Create Memorial",
    register_title: "Register",
    first_name: "First Name",
    last_name: "Last Name",
    email: "Email",
    password: "Password",
    confirm_password: "Confirm Password",
    register_now: "Register",
    partner_register_title: "Partner Registration",
    partner_register_msg: "To register as a partner (funeral home), please contact us to receive your unique Partner ID.",
    contact_us: "☎️ 6946772226\n📧 aliverious@gmail.com",
    back_to_register: "Back to Registration"
  },
  bg: {
    site_title: "MNIMIS.GR",
    home_title: "Дигитални Мемориални Страници",
    home_description: "Моменти, които остават живи. Създайте дигитално място за спомен за вашите близки с снимки, музика, видеа и пожелания. MNIMIS.GR предлага достоен начин за спомняне — с QR и NFC технологии.",
    get_started: "Създай Мемориал",
    register_title: "Регистрация",
    first_name: "Име",
    last_name: "Фамилия",
    email: "Имейл",
    password: "Парола",
    confirm_password: "Потвърдете паролата",
    register_now: "Регистрирай се",
    partner_register_title: "Регистрация на Партньор",
    partner_register_msg: "За да се регистрирате като партньор (погребална агенция), моля свържете се с нас, за да получите уникален партньорски номер.",
    contact_us: "☎️ 6946772226\n📧 aliverious@gmail.com",
    back_to_register: "Назад към Регистрацията"
  },
  ru: {
    site_title: "MNIMIS.GR",
    home_title: "Цифровые Мемориальные Страницы",
    home_description: "Моменты, которые остаются живыми. Создайте цифровое мемориальное пространство для своих близких с фотографиями, музыкой, видео и пожеланиями. MNIMIS.GR предлагает достойный способ помнить — с технологией QR и NFC.",
    get_started: "Создать Мемориал",
    register_title: "Регистрация",
    first_name: "Имя",
    last_name: "Фамилия",
    email: "Эл. почта",
    password: "Пароль",
    confirm_password: "Подтверждение пароля",
    register_now: "Зарегистрироваться",
    partner_register_title: "Регистрация Партнёра",
    partner_register_msg: "Чтобы зарегистрироваться как партнёр (ритуальная служба), пожалуйста, свяжитесь с нами для получения уникального партнёрского кода.",
    contact_us: "☎️ 6946772226\n📧 aliverious@gmail.com",
    back_to_register: "Назад к регистрации"
  },
  al: {
    site_title: "MNIMIS.GR",
    home_title: "Faqe Memoriale Dixhitale",
    home_description: "Momente që mbeten të gjalla. Krijoni një hapësirë dixhitale përkujtimore për të dashurit tuaj me foto, muzikë, video dhe urime. MNIMIS.GR ofron një mënyrë të denjë për të kujtuar — me teknologjinë QR dhe NFC.",
    get_started: "Krijo Memorial",
    register_title: "Regjistrohu",
    first_name: "Emri",
    last_name: "Mbiemri",
    email: "Email",
    password: "Fjalëkalimi",
    confirm_password: "Konfirmo fjalëkalimin",
    register_now: "Regjistrohu",
    partner_register_title: "Regjistrimi i Partnerit",
    partner_register_msg: "Për të krijuar një llogari si partner (zyrë funerale), ju lutemi kontaktoni me ne për të marrë një Numër Unik Partneri.",
    contact_us: "☎️ 6946772226\n📧 aliverious@gmail.com",
    back_to_register: "Kthehu te Regjistrimi"
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
