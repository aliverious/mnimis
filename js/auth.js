// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase.js";

// 🔧 Αρχικοποίηση Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Εγγραφή Συγγενή
export async function registerRelativeUser({ name, surname, email, password }) {
  try {
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
  } catch (error) {
    console.error("Σφάλμα κατά την εγγραφή:", error);
    alert("Σφάλμα: " + (error.message || "Απέτυχε η εγγραφή."));
  }
}

// ✅ Εγγραφή Συνεργάτη
export async function registerPartnerUser({ email, password, partnerCode }) {
  try {
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
  } catch (error) {
    console.error("Σφάλμα κατά την εγγραφή συνεργάτη:", error);
    alert("Σφάλμα: " + (error.message || "Απέτυχε η εγγραφή."));
  }
}
