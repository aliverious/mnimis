// js/auth.js
// === Εγγραφή / Σύνδεση Χρηστών με Ρόλο ===

import { auth, db } from './firebase.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import {
  doc, setDoc
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// === Εγγραφή Συγγενή ===
export async function registerUser(event) {
  event.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", userCredential.user.uid), {
      email: email,
      role: "relative"
    });
    alert("Η εγγραφή ολοκληρώθηκε.");
    window.location.href = "dashboard.html";
  } catch (error) {
    alert("Σφάλμα εγγραφής: " + error.message);
  }
}

// === Εγγραφή Συνεργάτη ===
export async function registerPartner(event) {
  event.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", userCredential.user.uid), {
      email: email,
      role: "partner"
    });
    alert("Εγγραφή συνεργάτη επιτυχής.");
    window.location.href = "dashboard.html";
  } catch (error) {
    alert("Σφάλμα συνεργάτη: " + error.message);
  }
}

// === Σύνδεση Χρήστη ===
export async function loginUser(event) {
  event.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "dashboard.html";
  } catch (error) {
    alert("Σφάλμα σύνδεσης: " + error.message);
  }
}

// === Google Login ===
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const userDocRef = doc(db, "users", result.user.uid);
    await setDoc(userDocRef, {
      email: result.user.email,
      role: "relative"
    }, { merge: true });
    window.location.href = "dashboard.html";
  } catch (error) {
    alert("Σφάλμα Google Login: " + error.message);
  }
}

// === Αποσύνδεση ===
export async function logoutUser() {
  await signOut(auth);
  window.location.href = "index.html";
}

window.registerUser = registerUser;
window.registerPartner = registerPartner;
window.loginUser = loginUser;
window.signInWithGoogle = signInWithGoogle;
window.logoutUser = logoutUser;
