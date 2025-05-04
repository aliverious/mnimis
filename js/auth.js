// js/auth.js
// Authentication logic: register, login, dashboard init, logout
import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import {
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { displayAlert } from "./ui.js";

/**
 * Register a new user and store role
 */
export async function registerUser(e) {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const role = document.getElementById('role').value;
  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'users', userCred.user.uid), { role, email, createdAt: new Date() });
    window.location = 'dashboard.html';
  } catch (err) {
    console.error(err);
    displayAlert(err.message, 'error');
  }
}

/**
 * Login existing user
 */
export async function loginUser(e) {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location = 'dashboard.html';
  } catch (err) {
    console.error(err);
    displayAlert(err.message, 'error');
  }
}

/**
 * Initialize dashboard: show controls based on role
 */
export function initDashboard() {
  onAuthStateChanged(auth, async user => {
    if (!user) {
      window.location = 'login.html';
      return;
    }
    const snap = await getDoc(doc(db, 'users', user.uid));
    const { role, email } = snap.data();
    document.getElementById('user-name').textContent = email;
    const controls = document.getElementById('controls');
    if (role === 'funeral_home') {
      controls.innerHTML = `
        <a href="memorial.html" class="btn" data-lang-key="create_memorial">Δημιουργία Memorial</a>
        <a href="admin.html" class="btn" data-lang-key="manage_memorials">Διαχείριση Memorials</a>
      `;
    } else {
      controls.innerHTML = `<p data-lang-key="welcome_relative">Καλώς ήρθες συγγενή!</p>`;
    }
  });
}

/**
 * Logout current user
 */
export async function logoutUser() {
  await signOut(auth);
  window.location = 'login.html';
}
```
