import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const dashboardContent = document.getElementById("dashboardContent");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const q = query(collection(db, "users"), where("uid", "==", user.uid));
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    dashboardContent.innerHTML = "<p>Σφάλμα: Δεν βρέθηκε ο χρήστης.</p>";
    return;
  }

  const userData = snapshot.docs[0].data();
  const role = userData.role;

  if (role === "relative") {
    dashboardContent.innerHTML = `
      <p data-lang-key="dashboard_relative">Καλώς ήρθατε. Εδώ μπορείτε να δημιουργήσετε νέα σελίδα μνήμης.</p>
      <a href="memorial.html" class="btn-main" data-lang-key="create_memorial">Δημιουργία Memorial</a>
    `;
  } else if (role === "partner") {
    dashboardContent.innerHTML = `
      <p data-lang-key="dashboard_partner">Καλώς ήρθατε συνεργάτη. Εδώ μπορείτε να προσθέσετε memorials για πελάτες σας.</p>
      <a href="memorial.html" class="btn-main" data-lang-key="add_partner_memorial">Προσθήκη Memorial</a>
    `;
  } else {
    dashboardContent.innerHTML = "<p>Ρόλος άγνωστος.</p>";
  }
});