// js/memorial_list.js
import { auth, db } from './firebase.js';
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import {
  collection, getDocs, doc, getDoc, orderBy, query
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const container = document.getElementById("memorials-container");
const filterInput = document.getElementById("filter-input");
const sortSelect = document.getElementById("sort-select");
const sortLabel = document.querySelector("label[for='sort-select']");
let allMemorials = [];

const sortOptions = {
  gr: {
    label: "Ταξινόμηση:",
    newest: "📅 Νεότερα",
    oldest: "📅 Παλαιότερα",
    az: "🔤 A–Z",
    za: "🔤 Z–A"
  },
  en: {
    label: "Sort:",
    newest: "📅 Newest",
    oldest: "📅 Oldest",
    az: "🔤 A–Z",
    za: "🔤 Z–A"
  },
  al: {
    label: "Renditja:",
    newest: "📅 Më të rejat",
    oldest: "📅 Më të vjetrat",
    az: "🔤 A–Zh",
    za: "🔤 Zh–A"
  },
  bg: {
    label: "Сортиране:",
    newest: "📅 Най-нови",
    oldest: "📅 Най-стари",
    az: "🔤 A–Я",
    za: "🔤 Я–A"
  },
  ru: {
    label: "Сортировка:",
    newest: "📅 Новейшие",
    oldest: "📅 Старейшие",
    az: "🔤 A–Я",
    za: "🔤 Я–A"
  }
};

function updateSortLabels() {
  const lang = localStorage.getItem("lang") || "gr";
  if (sortLabel && sortOptions[lang]) {
    sortLabel.textContent = sortOptions[lang].label;
    sortSelect.options[0].text = sortOptions[lang].newest;
    sortSelect.options[1].text = sortOptions[lang].oldest;
    sortSelect.options[2].text = sortOptions[lang].az;
    sortSelect.options[3].text = sortOptions[lang].za;
  }
}

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert("Απαιτείται σύνδεση.");
    window.location.href = "login.html";
    return;
  }

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists() || !["admin", "partner"].includes(userSnap.data().role)) {
    alert("Δεν έχετε δικαιώματα πρόσβασης.");
    window.location.href = "index.html";
    return;
  }

  const q = query(collection(db, "memorials"));
  const snapshot = await getDocs(q);
  allMemorials = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  renderMemorials(allMemorials);
  updateSortLabels();
});

function renderMemorials(list) {
  container.innerHTML = "";
  if (list.length === 0) {
    container.innerHTML = "<p>Δεν βρέθηκαν αποτελέσματα.</p>";
    return;
  }

  list.forEach(mem => {
    const div = document.createElement("div");
    div.className = "memorial-card";
    div.innerHTML = `
      <strong>${mem.fullname}</strong><br>
      ${mem.date_start} – ${mem.date_end}<br>
      <a href="memorial.html?id=${mem.id}">Προβολή</a> |
      <a href="edit_memorial.html?id=${mem.id}">Επεξεργασία</a>
    `;
    container.appendChild(div);
  });
}

filterInput.addEventListener("input", () => {
  const term = filterInput.value.toLowerCase();
  const filtered = allMemorials.filter(mem =>
    (mem.fullname || "").toLowerCase().includes(term) ||
    (mem.date_start || "").includes(term) ||
    (mem.date_end || "").includes(term)
  );
  renderMemorials(filtered);
});

sortSelect.addEventListener("change", () => {
  let sorted = [...allMemorials];
  const choice = sortSelect.value;

  if (choice === "newest") {
    sorted.sort((a, b) => (b.date_end || "").localeCompare(a.date_end || ""));
  } else if (choice === "oldest") {
    sorted.sort((a, b) => (a.date_end || "").localeCompare(b.date_end || ""));
  } else if (choice === "az") {
    sorted.sort((a, b) => (a.fullname || "").localeCompare(b.fullname || ""));
  } else if (choice === "za") {
    sorted.sort((a, b) => (b.fullname || "").localeCompare(a.fullname || ""));
  }

  renderMemorials(sorted);
});

window.addEventListener("DOMContentLoaded", updateSortLabels);
