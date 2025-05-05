// js/memorial.js
// === Load Memorial Data by UUID and Render ===

import { db, storage } from './firebase.js';
import { doc, getDoc, collection, addDoc, getDocs, Timestamp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";

// Λήψη UUID από το URL
const urlParams = new URLSearchParams(window.location.search);
const uuid = urlParams.get('id');

if (!uuid) {
  alert("Δεν βρέθηκε memorial.");
  window.location.href = "index.html";
}

// Φόρτωση memorial
async function loadMemorial() {
  const docRef = doc(db, "memorials", uuid);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    alert("Το memorial δεν υπάρχει.");
    window.location.href = "index.html";
    return;
  }

  const data = docSnap.data();

  document.getElementById("fullname").textContent = data.fullname || "";
  document.getElementById("birthplace").textContent = data.birthplace || "";
  document.getElementById("dates").textContent = `${data.date_start} - ${data.date_end}`;
  document.getElementById("video-link").href = data.video_url || "#";

  if (data.photo_path) {
    const photoRef = ref(storage, data.photo_path);
    const photoURL = await getDownloadURL(photoRef);
    document.getElementById("photo").src = photoURL;
  }

  if (data.audio_path) {
    const audioRef = ref(storage, data.audio_path);
    const audioURL = await getDownloadURL(audioRef);
    const player = document.getElementById("audio");
    player.src = audioURL;
    document.getElementById("music-player").style.display = "block";
  }

  initMap(data.mapLat, data.mapLng);
  loadComments();
}

async function loadComments() {
  const commentsCol = collection(db, `memorials/${uuid}/comments`);
  const commentSnapshot = await getDocs(commentsCol);
  const commentList = document.getElementById("comments-list");
  commentList.innerHTML = "";

  commentSnapshot.forEach((doc) => {
    const li = document.createElement("li");
    li.textContent = doc.data().text;
    commentList.appendChild(li);
  });
}

async function submitComment() {
  const comment = document.getElementById("comment-input").value.trim();
  if (!comment) return;
  const commentsCol = collection(db, `memorials/${uuid}/comments`);
  await addDoc(commentsCol, {
    text: comment,
    createdAt: Timestamp.now()
  });
  document.getElementById("comment-input").value = "";
  loadComments();
}

function downloadPDF() {
  alert("📄 Υποστήριξη PDF σε μελλοντική έκδοση.");
}

function generateQRCode() {
  const link = window.location.href;
  window.open(`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(link)}&size=200x200`, '_blank');
}

function reportMemorial() {
  alert("🚨 Η αναφορά memorial καταχωρήθηκε.");
}

function initMap(lat, lng) {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 14,
    center: { lat: lat || 38.4, lng: lng || 23.9 }
  });

  new google.maps.Marker({
    position: { lat: lat || 38.4, lng: lng || 23.9 },
    map: map
  });
}

loadMemorial();
window.submitComment = submitComment;
window.downloadPDF = downloadPDF;
window.generateQRCode = generateQRCode;
window.reportMemorial = reportMemorial;

import { deleteObject, ref as storageRef } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";
import { deleteDoc, collection, getDocs, doc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// === Διαγραφή memorial ===
async function deleteMemorial() {
  const confirmDelete = confirm("⚠️ Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το memorial;");
  if (!confirmDelete) return;

  try {
    const docSnap = await getDoc(doc(db, "memorials", uuid));
    if (!docSnap.exists()) {
      alert("Το memorial δεν βρέθηκε.");
      return;
    }

    const data = docSnap.data();
    const user = auth.currentUser;

    if (!user) {
      alert("Πρέπει να είστε συνδεδεμένοι.");
      return;
    }

    const userSnap = await getDoc(doc(db, "users", user.uid));
    const role = userSnap.data().role;
    const isOwner = data.createdBy === user.uid;
    const isAdmin = role === "admin";

    if (!isOwner && !isAdmin) {
      alert("Δεν έχετε δικαίωμα διαγραφής.");
      return;
    }

    // 🔥 Διαγραφή comments subcollection
    const commentsCol = collection(db, `memorials/${uuid}/comments`);
    const commentSnapshot = await getDocs(commentsCol);
    for (const cmt of commentSnapshot.docs) {
      await deleteDoc(cmt.ref);
    }

    // 🔥 Διαγραφή αρχείων από Storage
    if (data.photo_path) {
      const photoRef = storageRef(storage, data.photo_path);
      await deleteObject(photoRef).catch(() => {});
    }
    if (data.audio_path) {
      const audioRef = storageRef(storage, data.audio_path);
      await deleteObject(audioRef).catch(() => {});
    }

    // 🔥 Διαγραφή memorial document
    await deleteDoc(doc(db, "memorials", uuid));

    alert("Το memorial διαγράφηκε με επιτυχία.");
    window.location.href = "dashboard.html";
  } catch (err) {
    console.error(err);
    alert("Σφάλμα κατά τη διαγραφή: " + err.message);
  }
}

window.deleteMemorial = deleteMemorial;

import { query, orderBy } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Προβολή logs
async function showLogs() {
  const logsSection = document.getElementById("logs-section");
  const logsList = document.getElementById("logs-list");

  // Toggle εμφάνισης
  logsSection.style.display = logsSection.style.display === "none" ? "block" : "none";
  logsList.innerHTML = "";

  try {
    const logsRef = collection(db, `memorials/${uuid}/logs`);
    const logsSnap = await getDocs(query(logsRef, orderBy("timestamp", "desc")));

    if (logsSnap.empty) {
      logsList.innerHTML = "<li>Δεν υπάρχουν αλλαγές.</li>";
      return;
    }

    logsSnap.forEach((doc) => {
      const log = doc.data();
      const li = document.createElement("li");
      const when = new Date(log.timestamp).toLocaleString();
      const who = log.changedBy;
      const details = Object.entries(log.changes).map(([k, v]) =>
        `<strong>${k}</strong>: '${v.from}' → '${v.to}'`).join("<br>");

      li.innerHTML = `🕒 <em>${when}</em> από <code>${who}</code><br>${details}<hr>`;
      logsList.appendChild(li);
    });
  } catch (err) {
    logsList.innerHTML = `<li>⚠️ Σφάλμα: ${err.message}</li>`;
  }
}

window.showLogs = showLogs;
