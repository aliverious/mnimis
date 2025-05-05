// js/firebase.js
// === Firebase Initialization File for MNIMIS.GR ===

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAncmHSVhdTxNxLMEnHn0a8hXbrhNjfIAU",
  authDomain: "mnimis.firebaseapp.com",
  projectId: "mnimis",
  storageBucket: "mnimis.appspot.com",
  messagingSenderId: "776661897022",
  appId: "1:776661897022:web:a59ef94d2892b52916666f"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
