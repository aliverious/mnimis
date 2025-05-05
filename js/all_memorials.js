// js/all_memorials.js
import { auth, db } from './firebase.js';
import {
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert("Πρέπει να είστε συνδεδεμένοι.");
    window.location.href = "login.html";
    return;
  }

  const listContainer = document.getElementById("memorials-list");
  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Αναζήτηση ονόματος...";
  searchInput.style.marginBottom = "1rem";
  listContainer.parentNode.insertBefore(searchInput, listContainer);

  const filterMineCheckbox = document.createElement("input");
  filterMineCheckbox.type = "checkbox";
  filterMineCheckbox.id = "filterMine";
  const filterLabel = document.createElement("label");
  filterLabel.htmlFor = "filterMine";
  filterLabel.innerText = " Εμφάνιση μόνο δικών μου Memorials";
  listContainer.parentNode.insertBefore(filterLabel, listContainer);
  listContainer.parentNode.insertBefore(filterMineCheckbox, filterLabel);

  async function loadMemorials() {
    listContainer.innerHTML = "<p>Φόρτωση...</p>";
    try {
      const q = query(collection(db, "memorials"), orderBy("date_end", "desc"));
      const snapshot = await getDocs(q);

      const searchTerm = searchInput.value.toLowerCase();
      const onlyMine = filterMineCheckbox.checked;

      const results = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (
          (!searchTerm || data.fullname.toLowerCase().includes(searchTerm)) &&
          (!onlyMine || data.createdBy === user.uid)
        ) {
          results.push({ id: doc.id, ...data });
        }
      });

      if (results.length === 0) {
        listContainer.innerHTML = "<p>Δεν βρέθηκαν αποτελέσματα.</p>";
        return;
      }

      listContainer.innerHTML = "";
      results.forEach((data) => {
        const div = document.createElement("div");
        div.className = "memorial-card";
        div.innerHTML = `
          <strong>${data.fullname}</strong><br>
          ${data.date_start} - ${data.date_end}<br>
          <a href="memorial.html?id=${data.id}" target="_blank">Προβολή</a>
        `;
        listContainer.appendChild(div);
      });

    } catch (error) {
      console.error("Σφάλμα φόρτωσης memorials:", error);
      listContainer.innerHTML = `<p>Σφάλμα: ${error.message}</p>`;
    }
  }

  searchInput.addEventListener("input", loadMemorials);
  filterMineCheckbox.addEventListener("change", loadMemorials);

  loadMemorials();
});
