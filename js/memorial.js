import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, doc, getDoc, collection, addDoc, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (!id) {
  alert("Δεν βρέθηκε κωδικός memorial.");
  throw new Error("Λείπει το ID.");
}

const photoEl = document.getElementById("photo");
const fullNameEl = document.getElementById("fullName");
const birthPlaceEl = document.getElementById("birthPlace");
const lifespanEl = document.getElementById("lifespan");
const videoSection = document.getElementById("videoSection");
const musicSection = document.getElementById("musicSection");
const commentList = document.getElementById("commentList");

// 🔄 Φόρτωση δεδομένων memorial
async function loadMemorial() {
  const docRef = doc(db, "memorials", id);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    fullNameEl.textContent = "Δεν βρέθηκε memorial.";
    return;
  }

  const data = snapshot.data();

  fullNameEl.textContent = data.fullName || "";
  birthPlaceEl.textContent = data.birthPlace || "";
  lifespanEl.textContent = data.lifespan || "";
  if (data.photoURL) photoEl.src = data.photoURL;

  if (data.videoURL) {
    const iframe = document.createElement("iframe");
    iframe.src = data.videoURL;
    iframe.width = "100%";
    iframe.height = "315";
    iframe.allowFullscreen = true;
    videoSection.appendChild(iframe);
  }

  if (data.musicURL) {
    const audio = document.createElement("audio");
    audio.src = data.musicURL;
    audio.controls = true;
    musicSection.appendChild(audio);
  }

  // Αν έχει συντεταγμένες -> εμφάνιση Google Maps
  if (data.location && data.location.lat && data.location.lng) {
    const mapFrame = document.createElement("iframe");
    mapFrame.src = `https://www.google.com/maps?q=${data.location.lat},${data.location.lng}&hl=el&z=16&output=embed`;
    mapFrame.width = "100%";
    mapFrame.height = "250";
    mapFrame.style.border = "0";
    document.getElementById("map").appendChild(mapFrame);
  }
}

// 💬 Σχόλια
window.submitComment = async function (e) {
  e.preventDefault();
  const text = document.getElementById("commentText").value.trim();
  if (!text) return;

  await addDoc(collection(db, "memorials", id, "comments"), {
    text,
    createdAt: new Date().toISOString()
  });

  document.getElementById("commentText").value = "";
};

function loadComments() {
  const q = query(collection(db, "memorials", id, "comments"), orderBy("createdAt", "desc"));
  onSnapshot(q, (snapshot) => {
    commentList.innerHTML = "";
    snapshot.forEach((doc) => {
      const p = document.createElement("p");
      p.textContent = doc.data().text;
      commentList.appendChild(p);
    });
  });
}

// 🆘 Αναφορά memorial
window.reportMemorial = function () {
  alert("Η λειτουργία αναφοράς memorial θα ενεργοποιηθεί σύντομα.");
};

loadMemorial();
loadComments();
