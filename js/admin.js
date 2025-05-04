// js/admin.js
// Admin panel logic: approve/reject memorials and offices
import { db } from "./firebase.js";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { displayAlert } from "./ui.js";

/**
 * Initialize admin panel
 */
export async function initAdminPanel() {
  try {
    // Fetch pending memorials
    const memRef = collection(db, 'memorials');
    const q1 = query(memRef, where('status', '==', 'pending'));
    const memSnap = await getDocs(q1);
    const memList = document.getElementById('pending-memorials');
    memSnap.forEach(docSnap => {
      const data = docSnap.data();
      const div = document.createElement('div');
      div.className = 'pending-item';
      div.innerHTML = `
        <p>${data.firstName} ${data.lastName} (${data.birth} – ${data.death})</p>
        <button class="btn" onclick="approveMemorial('${docSnap.id}')">Approve</button>
        <button class="btn" onclick="rejectMemorial('${docSnap.id}')">Reject</button>
      `;
      memList.appendChild(div);
    });
    // Fetch pending funeral offices
    const offRef = collection(db, 'users');
    const q2 = query(offRef, where('role', '==', 'funeral_home'), where('approved', '==', false));
    const offSnap = await getDocs(q2);
    const offList = document.getElementById('pending-offices');
    offSnap.forEach(docSnap => {
      const data = docSnap.data();
      const div = document.createElement('div');
      div.className = 'pending-item';
      div.innerHTML = `
        <p>${data.email}</p>
        <button class="btn" onclick="approveOffice('${docSnap.id}')">Approve</button>
        <button class="btn" onclick="rejectOffice('${docSnap.id}')">Reject</button>
      `;
      offList.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    displayAlert('Error loading admin data', 'error');
  }
}

/**
 * Approve a memorial
 */
export async function approveMemorial(id) {
  await updateDoc(doc(db, 'memorials', id), { status: 'approved' });
  displayAlert('Memorial approved', 'success');
  location.reload();
}

/**
 * Reject a memorial
 */
export async function rejectMemorial(id) {
  await updateDoc(doc(db, 'memorials', id), { status: 'rejected' });
  displayAlert('Memorial rejected', 'info');
  location.reload();
}

/**
 * Approve a funeral office
 */
export async function approveOffice(id) {
  await updateDoc(doc(db, 'users', id), { approved: true });
  displayAlert('Office approved', 'success');
  location.reload();
}

/**
 * Reject a funeral office
 */
export async function rejectOffice(id) {
  await updateDoc(doc(db, 'users', id), { approved: false });
  displayAlert('Office rejected', 'info');
  location.reload();
}