// js/memorial_create.js
// === Δημιουργία Memorial από Συνεργάτη ή Admin ===

import { auth, db, storage } from './firebase.js';
import {
  doc, setDoc, collection, getDoc
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import {
  ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// 🔐 Έλεγχος ρόλου χρήστη
let currentUser;
let currentUid;

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert("Απαιτείται σύνδεση.");
    window.location.href = "login.html";
    return;
  }

  currentUser = user;
  currentUid = user.uid;

  const userRef = doc(db, "users", currentUid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists() || (userSnap.data().role !== "partner" && userSnap.data().role !== "admin")) {
    alert("Δεν έχετε δικαίωμα πρόσβασης.");
    window.location.href = "index.html";
    return;
  }
});

// 📥 Υποβολή φόρμας memorial
document.getElementById("memorial-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const fullname = document.getElementById("fullname").value.trim();
  const birthplace = document.getElementById("birthplace").value.trim();
  const date_start = document.getElementById("date_start").value;
  const date_end = document.getElementById("date_end").value;
  const video_url = document.getElementById("video_url").value.trim();
  const mapLat = parseFloat(document.getElementById("mapLat").value) || null;
  const mapLng = parseFloat(document.getElementById("mapLng").value) || null;

  const photoFile = document.getElementById("photo").files[0];
  const audioFile = document.getElementById("audio").files[0];

  if (!photoFile) {
    alert("Απαιτείται φωτογραφία.");
    return;
  }

  try {
    const uuid = crypto.randomUUID();

    // 🔼 Ανεβάζουμε φωτογραφία
    const photoRef = ref(storage, `memorials/${uuid}/photo.jpg`);
    await uploadBytes(photoRef, photoFile);

    let audioPath = null;

    if (audioFile) {
      const audioRef = ref(storage, `memorials/${uuid}/audio.mp3`);
      await uploadBytes(audioRef, audioFile);
      audioPath = `memorials/${uuid}/audio.mp3`;
    }

    // 📝 Αποθήκευση memorial στο Firestore
    const memorialData = {
      fullname,
      birthplace,
      date_start,
      date_end,
      video_url,
      mapLat,
      mapLng,
      createdBy: currentUid,
      photo_path: `memorials/${uuid}/photo.jpg`,
      audio_path: audioPath || null,
      createdAt: new Date().toISOString()
    };

    await setDoc(doc(db, "memorials", uuid), memorialData);

    alert("Το memorial δημιουργήθηκε με επιτυχία.");
    window.location.href = `memorial.html?id=${uuid}`;
  } catch (err) {
    console.error(err);
    alert("Σφάλμα κατά την αποθήκευση του memorial: " + err.message);
  }
});
