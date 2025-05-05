// js/edit_memorial.js
import { auth, db, storage } from './firebase.js';
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import {
  ref,
  uploadBytes,
  deleteObject
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

let currentUser = null;
const urlParams = new URLSearchParams(window.location.search);
const uuid = urlParams.get('id');

if (!uuid) {
  alert("Λείπει το ID του memorial.");
  window.location.href = "index.html";
}

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert("Πρέπει να είστε συνδεδεμένοι.");
    window.location.href = "login.html";
    return;
  }

  currentUser = user;
  await logView();
  await loadMemorial();
  await loadLogs();

  const userDoc = await getDoc(doc(db, "users", user.uid));
  if (userDoc.exists()) {
    const role = userDoc.data().role;
    if (role === "admin") {
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "🗑 Διαγραφή Memorial";
      deleteBtn.style.backgroundColor = "crimson";
      deleteBtn.style.marginTop = "1rem";
      deleteBtn.onclick = deleteMemorial;
      document.querySelector("main").appendChild(deleteBtn);
    }
  }
});

async function logView() {
  try {
    await addDoc(collection(db, `memorials/${uuid}/logs`), {
      type: "view",
      by: currentUser?.uid || "anonymous",
      at: serverTimestamp(),
      changes: []
    });
  } catch (err) {
    console.warn("Αποτυχία καταγραφής προβολής memorial:", err);
  }
}

async function loadMemorial() {
  const refDoc = doc(db, "memorials", uuid);
  const snapshot = await getDoc(refDoc);

  if (!snapshot.exists()) {
    alert("Το memorial δεν βρέθηκε.");
    window.location.href = "index.html";
    return;
  }

  const data = snapshot.data();
  document.getElementById('fullname').value = data.fullname || "";
  document.getElementById('birthplace').value = data.birthplace || "";
  document.getElementById('date_start').value = data.date_start || "";
  document.getElementById('date_end').value = data.date_end || "";
  document.getElementById('video_url').value = data.video_url || "";
  document.getElementById('mapLat').value = data.mapLat || "";
  document.getElementById('mapLng').value = data.mapLng || "";
}

async function loadLogs() {
  const logsContainer = document.createElement("div");
  logsContainer.id = "logs-section";
  logsContainer.innerHTML = "<h3>Ιστορικό Αλλαγών</h3><ul id='logs-list'></ul>";
  document.querySelector("main").appendChild(logsContainer);

  const logsList = document.getElementById("logs-list");
  const q = query(collection(db, `memorials/${uuid}/logs`), orderBy("at", "desc"));
  const snapshot = await getDocs(q);

  for (const log of snapshot.docs) {
    const data = log.data();
    let userEmail = data.by;

    try {
      const userDoc = await getDoc(doc(db, "users", data.by));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        userEmail = userData.email || data.by;
      }
    } catch (err) {
      console.error("Σφάλμα ανάκτησης email:", err);
    }

    const li = document.createElement("li");
    li.textContent = `🕒 ${data.at?.toDate().toLocaleString()} – ✍️ ${userEmail} – 🔧 ${data.type} (${(data.changes || []).join(", ")})`;
    logsList.appendChild(li);
  }
}

export async function updateMemorial(event) {
  event.preventDefault();

  const fullname = document.getElementById('fullname').value.trim();
  const birthplace = document.getElementById('birthplace').value.trim();
  const date_start = document.getElementById('date_start').value;
  const date_end = document.getElementById('date_end').value;
  const video_url = document.getElementById('video_url').value.trim();
  const mapLat = parseFloat(document.getElementById('mapLat').value);
  const mapLng = parseFloat(document.getElementById('mapLng').value);

  const updates = {
    fullname,
    birthplace,
    date_start,
    date_end,
    video_url,
    mapLat,
    mapLng,
    updatedAt: serverTimestamp(),
    updatedBy: currentUser.uid
  };

  const photoFile = document.getElementById('photo').files[0];
  const audioFile = document.getElementById('audio').files[0];

  if (photoFile) {
    const photoPath = `memorials/${uuid}/photo.jpg`;
    const photoRef = ref(storage, photoPath);
    await uploadBytes(photoRef, photoFile);
    updates.photo_path = photoPath;
  }

  if (audioFile) {
    const audioPath = `memorials/${uuid}/audio.mp3`;
    const audioRef = ref(storage, audioPath);
    await uploadBytes(audioRef, audioFile);
    updates.audio_path = audioPath;
  }

  await updateDoc(doc(db, "memorials", uuid), updates);

  await addDoc(collection(db, `memorials/${uuid}/logs`), {
    type: "update",
    by: currentUser.uid,
    at: serverTimestamp(),
    changes: Object.keys(updates)
  });

  alert("Οι αλλαγές αποθηκεύτηκαν.");
  window.location.href = `memorial.html?id=${uuid}`;
}

export async function deleteMemorial() {
  if (!confirm("Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το memorial;")) return;

  try {
    await deleteDoc(doc(db, "memorials", uuid));
    await addDoc(collection(db, `memorials/${uuid}/logs`), {
      type: "delete",
      by: currentUser.uid,
      at: serverTimestamp(),
      changes: []
    });
    alert("Το memorial διαγράφηκε.");
    window.location.href = "index.html";
  } catch (err) {
    alert("Σφάλμα κατά τη διαγραφή: " + err.message);
  }
}

window.updateMemorial = updateMemorial;
window.deleteMemorial = deleteMemorial;
