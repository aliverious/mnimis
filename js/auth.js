// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase.js";

// 🔧 Αρχικοποίηση Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Εγγραφή Συγγενή
export async function registerRelativeUser({ name, surname, email, password }) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;

  await setDoc(doc(db, "users", uid), {
    uid,
    role: "relative",
    name,
    surname,
    email,
    createdAt: new Date().toISOString()
  });

  alert("Εγγραφή επιτυχής! Μπορείτε τώρα να συνδεθείτε.");
  window.location.href = "login.html";
}

// ✅ Εγγραφή Συνεργάτη
export async function registerPartnerUser({ email, password, partnerCode }) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;

  await setDoc(doc(db, "users", uid), {
    uid,
    role: "partner",
    partnerCode,
    email,
    createdAt: new Date().toISOString()
  });

  alert("Εγγραφή συνεργάτη επιτυχής! Μπορείτε τώρα να συνδεθείτε.");
  window.location.href = "login.html";
}

// ✅ Σύνδεση με Email & Κωδικό
export async function loginWithEmail(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;

  const userDoc = await getDoc(doc(db, "users", uid));
  if (userDoc.exists()) {
    const role = userDoc.data().role;
    if (role === "relative") {
      window.location.href = "dashboard.html";
    } else if (role === "partner") {
      window.location.href = "dashboard.html";
    } else {
      alert("Άγνωστος ρόλος χρήστη.");
    }
  } else {
    alert("Δεν βρέθηκαν δεδομένα χρήστη.");
  }
}
