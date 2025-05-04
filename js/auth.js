import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, OAuthProvider } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let selectedRole = null;

const btnRelative = document.getElementById("btn-relative");
const btnPartner = document.getElementById("btn-partner");
const registerForm = document.getElementById("registerForm");

if (btnRelative) {
  btnRelative.addEventListener("click", () => {
    selectedRole = "relative";
    registerForm.style.display = "block";
  });
}

if (btnPartner) {
  btnPartner.addEventListener("click", () => {
    window.location.href = "register_partner.html";
  });
}

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const surname = document.getElementById("surname").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      alert("Οι κωδικοί δεν ταιριάζουν.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email,
        name,
        surname,
        role: selectedRole,
        approved: selectedRole === "relative" ? true : false,
        createdAt: new Date().toISOString()
      });

      alert("Η εγγραφή ολοκληρώθηκε με επιτυχία.");
      window.location.href = "dashboard.html";
    } catch (error) {
      alert("Σφάλμα: " + error.message);
    }
  });
}

// Social logins (Google, Microsoft, Facebook)
const socialLogin = async (provider) => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      name: user.displayName,
      role: "relative",
      approved: true,
      createdAt: new Date().toISOString()
    });

    window.location.href = "dashboard.html";
  } catch (error) {
    alert("Social Login Error: " + error.message);
  }
};

window.googleLogin = () => socialLogin(new GoogleAuthProvider());
window.microsoftLogin = () => socialLogin(new OAuthProvider("microsoft.com"));
window.facebookLogin = () => socialLogin(new FacebookAuthProvider());
