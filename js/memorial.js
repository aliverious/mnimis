import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, doc, getDoc, collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const params = new URLSearchParams(window.location.search);
const memorialId = params.get("id");

const photo = document.getElementById("photo");
const fullName = document.getElementById("fullName");
const birthPlace = document.getElementById("birthPlace");
const lifespan = document.getElementById("lifespan");
const videoSection = document.getElementById("videoSection");
const musicSection = document.getElementById("musicSection");
const map = document.getElementById("map");
const commentList = document.getElementById("commentList");

async function loadMemorial() {
  if (!memorialId) return;

  const docRef = doc(db, "memorials", memorialId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    fullName.textContent = "Το memorial δεν βρέθηκε.";
    return;
  }

  const data = docSnap.data();
  photo.src = data.photoURL || "";
  fullName.textContent = `${data.firstName} ${data.lastName}`;
  birthPlace.textContent = data.birthPlace || "";
  lifespan.textContent = `${data.birthDate || "?"} – ${data.deathDate || "?"}`;

  if (data.videoURL) {
    videoSection.innerHTML = `<iframe width="100%" height="315" src="${data.videoURL}" frameborder="0" allowfullscreen></iframe>`;
  }

  if (data.musicURL) {
    musicSection.innerHTML = `<audio controls style="width: 100%;"><source src="${data.musicURL}" type="audio/mpeg"></audio>`;
  }

  if (data.cemeteryLocation) {
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.google.com/maps?q=${encodeURIComponent(data.cemeteryLocation)}&output=embed`;
    iframe.width = "100%";
    iframe.height = "250";
    iframe.style.border = "0";
    map.appendChild(iframe);
  }

  loadComments();
}

async function loadComments() {
  const q = query(collection(db, "comments"), where("memorialId", "==", memorialId));
  const snapshot = await getDocs(q);
  commentList.innerHTML = "";
  snapshot.forEach(doc => {
    const comment = doc.data();
    const div = document.createElement("div");
    div.textContent = comment.text;
    commentList.appendChild(div);
  });
}

window.submitComment = async function(event) {
  event.preventDefault();
  const commentText = document.getElementById("commentText").value.trim();
  if (!commentText) return;

  await addDoc(collection(db, "comments"), {
    memorialId,
    text: commentText,
    createdAt: new Date().toISOString()
  });

  document.getElementById("commentText").value = "";
  loadComments();
};

window.reportMemorial = () => {
  alert("Η αναφορά καταχωρήθηκε. Θα ελεγχθεί σύντομα από τη διαχείριση.");
};

loadMemorial();
