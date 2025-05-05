// js/create_memorial.js
import { auth, db, storage } from './firebase.js';
import {
  doc,
  setDoc,
  collection,
  serverTimestamp,
  addDoc
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import {
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

let currentUser = null;

onAuthStateChanged(auth, (user) => {
  if (!user) {
    alert("Πρέπει να είστε συνδεδεμένοι.");
    window.location.href = "login.html";
  } else {
    currentUser = user;
  }
});

export async function createMemorial(event) {
  event.preventDefault();

  const fullname = document.getElementById('fullname').value.trim();
  const birthplace = document.getElementById('birthplace').value.trim();
  const date_start = document.getElementById('date_start').value;
  const date_end = document.getElementById('date_end').value;
  const video_url = document.getElementById('video_url').value.trim();
  const mapLat = parseFloat(document.getElementById('mapLat').value) || 38.4;
  const mapLng = parseFloat(document.getElementById('mapLng').value) || 23.9;

  const photoFile = document.getElementById('photo').files[0];
  const audioFile = document.getElementById('audio').files[0];

  if (!photoFile) {
    alert("Η φωτογραφία είναι υποχρεωτική.");
    return;
  }

  try {
    const newMemorialRef = await addDoc(collection(db, "memorials"), {
      fullname,
      birthplace,
      date_start,
      date_end,
      video_url,
      mapLat,
      mapLng,
      createdBy: currentUser.uid,
      createdAt: serverTimestamp()
    });

    const memorialId = newMemorialRef.id;
    const updates = {};

    // 📸 Upload Photo
    const photoPath = `memorials/${memorialId}/photo.jpg`;
    const photoRef = ref(storage, photoPath);
    await uploadBytes(photoRef, photoFile);
    updates.photo_path = photoPath;

    // 🎵 Upload Audio (optional)
    if (audioFile) {
      const audioPath = `memorials/${memorialId}/audio.mp3`;
      const audioRef = ref(storage, audioPath);
      await uploadBytes(audioRef, audioFile);
      updates.audio_path = audioPath;
    }

    // 🔁 Update Firestore with file paths
    await setDoc(doc(db, "memorials", memorialId), updates, { merge: true });

    alert("Το memorial δημιουργήθηκε με επιτυχία.");
    window.location.href = `memorial.html?id=${memorialId}`;

  } catch (err) {
    console.error(err);
    alert("Σφάλμα δημιουργίας: " + err.message);
  }
}

window.createMemorial = createMemorial;
