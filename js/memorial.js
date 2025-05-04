// js/memorial.js
// Logic for loading and interacting with a memorial page
import { db, storage } from "./firebase.js";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-storage.js";
import { displayAlert } from "./ui.js";
import { sanitize } from "./ui.js";

// Extract memorial ID from URL
const params = new URLSearchParams(window.location.search);
const memorialId = params.get('id');

/**
 * Initialize memorial page
 */
export async function initMemorialPage() {
  if (!memorialId) {
    displayAlert('Invalid memorial ID', 'error');
    return;
  }
  const memSnap = await getDoc(doc(db, 'memorials', memorialId));
  if (!memSnap.exists()) {
    displayAlert('Memorial not found', 'error');
    return;
  }
  const data = memSnap.data();
  // Load image
  const imgUrl = await getDownloadURL(ref(storage, data.photoPath));
  document.getElementById('memorial-photo').src = imgUrl;
  document.getElementById('memorial-name').textContent = `${data.firstName} ${data.lastName}`;
  document.getElementById('memorial-dates').textContent = `${data.birth} – ${data.death}`;
  // Video embed
  if (data.videoUrl) {
    const vidContainer = document.getElementById('memorial-video');
    vidContainer.innerHTML = `<iframe src="${data.videoUrl}" frameborder="0" allowfullscreen></iframe>`;
  }
  // Music
  if (data.musicUrl) {
    const musicEl = document.getElementById('memorial-music');
    musicEl.src = data.musicUrl;
  }
  // TODO: Google Maps initialization based on data.cemeteryLocation
  // Load comments
  await loadComments();
}

/**
 * Load approved comments
 */
async function loadComments() {
  const cQuery = query(collection(db, 'memorials', memorialId, 'comments'), where('approved', '==', true));
  const cSnap = await getDocs(cQuery);
  const list = document.getElementById('comments-list');
  cSnap.forEach(docSnap => {
    const c = docSnap.data();
    const li = document.createElement('li');
    li.textContent = sanitize(c.text);
    list.appendChild(li);
  });
  document.getElementById('comment-form').addEventListener('submit', postComment);
}

/**
 * Post a new comment for approval
 */
async function postComment(e) {
  e.preventDefault();
  const input = document.getElementById('comment-input');
  const text = input.value;
  if (!text.trim()) return;
  await addDoc(collection(db, 'memorials', memorialId, 'comments'), {
    text: sanitize(text),
    createdAt: serverTimestamp(),
    approved: false
  });
  displayAlert('Comment submitted for approval', 'info');
  e.target.reset();
}

// On page load
window.addEventListener('DOMContentLoaded', initMemorialPage);
