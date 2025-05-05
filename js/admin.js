// js/admin.js
// === Διαχείριση Memorials από Συνεργάτες/Admin ===

import { db, auth } from './firebase.js';
import { collection, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// Έλεγχος εξουσιοδότησης
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert("Απαιτείται σύνδεση.");
    window.location.href = "login.html";
    return;
  }

  const uid = user.uid;
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists() || (userSnap.data().role !== "admin" && userSnap.data().role !== "partner")) {
    alert("Δεν έχετε δικαίωμα πρόσβασης.");
    window.location.href = "index.html";
    return;
  }

  loadMemorials();
});

// Φόρτωση όλων των memorials
async function loadMemorials() {
  const memorialsCol = collection(db, "memorials");
  const snapshot = await getDocs(memorialsCol);
  const container = document.getElementById("admin-list");

  container.innerHTML = "";
  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const div = document.createElement("div");
    div.className = "memorial-card";
    div.innerHTML = `
      <strong>${data.fullname}</strong><br>
      ${data.date_start} – ${data.date_end}<br>
      <button onclick="deleteMemorial('${docSnap.id}')">🗑 Διαγραφή</button>
      <a href="memorial.html?id=${docSnap.id}" target="_blank">Προβολή</a>
    `;
    container.appendChild(div);
  });
}

// Διαγραφή memorial
async function deleteMemorial(id) {
  if (!confirm("Είστε σίγουροι;")) return;
  await deleteDoc(doc(db, "memorials", id));
  alert("Το memorial διαγράφηκε.");
  loadMemorials();
}

window.deleteMemorial = deleteMemorial;
