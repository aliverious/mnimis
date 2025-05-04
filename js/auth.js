
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

import { firebaseConfig } from './firebase.js';
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Εγγραφή συγγενή
const relativeForm = document.getElementById("registerRelativeForm");
if (relativeForm) {
  relativeForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      alert("Οι κωδικοί δεν ταιριάζουν.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      await setDoc(doc(db, "users", uid), {
        firstName,
        lastName,
        email,
        role: "relative"
      });
      alert("Επιτυχής εγγραφή!");
      window.location.href = "dashboard.html";
    } catch (error) {
      alert("Σφάλμα: " + error.message);
    }
  });
}

// Εγγραφή συνεργάτη
const partnerForm = document.getElementById("partnerRegisterForm");
if (partnerForm) {
  partnerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const partnerCode = document.getElementById("partnerCode")?.value.trim();

    if (password !== confirmPassword) {
      alert("Οι κωδικοί δεν ταιριάζουν.");
      return;
    }

    if (!partnerCode) {
      alert("Απαιτείται έγκυρος Κωδικός Συνεργάτη.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      await setDoc(doc(db, "users", uid), {
        firstName,
        lastName,
        email,
        role: "partner",
        partnerCode
      });
      alert("Επιτυχής εγγραφή συνεργάτη!");
      window.location.href = "dashboard.html";
    } catch (error) {
      alert("Σφάλμα: " + error.message);
    }
  });
}
