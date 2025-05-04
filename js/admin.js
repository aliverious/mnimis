import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, getDocs, updateDoc, doc, query, where } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const pendingMemorials = document.getElementById("pendingMemorials");
const pendingPartners = document.getElementById("pendingPartners");

async function loadMemorials() {
  const q = query(collection(db, "memorials"), where("approved", "==", false));
  const snapshot = await getDocs(q);
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const item = document.createElement("div");
    item.innerHTML = `
      <p><strong>${data.firstName} ${data.lastName}</strong></p>
      <button onclick="approveMemorial('${docSnap.id}')">✅ Έγκριση</button>
    `;
    pendingMemorials.appendChild(item);
  });
}

async function loadPartners() {
  const q = query(collection(db, "users"), where("role", "==", "partner"), where("approved", "==", false));
  const snapshot = await getDocs(q);
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const item = document.createElement("div");
    item.innerHTML = `
      <p><strong>${data.name} ${data.surname}</strong> (${data.email})</p>
      <button onclick="approvePartner('${docSnap.id}')">✅ Έγκριση</button>
    `;
    pendingPartners.appendChild(item);
  });
}

window.approveMemorial = async (id) => {
  await updateDoc(doc(db, "memorials", id), {
    approved: true
  });
  alert("Memorial εγκρίθηκε.");
  location.reload();
};

window.approvePartner = async (id) => {
  await updateDoc(doc(db, "users", id), {
    approved: true
  });
  alert("Ο συνεργάτης εγκρίθηκε.");
  location.reload();
};

loadMemorials();
loadPartners();
