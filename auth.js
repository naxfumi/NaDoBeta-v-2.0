// ══════════════════════════════════════════════════
// auth.js — Firebase Auth handler
// ══════════════════════════════════════════════════
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";



// Ganti dengan config Firebase kamu
const firebaseConfig = {
  apiKey: "AIzaSyDEqRjayX6uok6UIDka1Py7lMhURpvGaMw",
  authDomain: "nadomped.firebaseapp.com",
  projectId: "nadomped",
  storageBucket: "nadomped.firebasestorage.app",
  messagingSenderId: "813627030723",
  appId: "1:813627030723:web:fcf98b72570331a981f676",
  measurementId: "G-NEPG2RCJ8R"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ── CEK SESSION ────────────────────────────────────
// Kalau belum login → redirect ke halaman login
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.replace = 'login.html';
    return;
  }

  // User sudah login — simpan info ke window supaya bisa diakses main.js
  window.currentUser = {
    uid: user.uid,
    name: user.displayName,
    email: user.email,
    photo: user.photoURL,
  };

  // Tampilkan nama user di topbar kalau ada elemennya
  const nameEl = document.getElementById('userDisplayName');
  const photoEl = document.getElementById('userPhoto');
  if (nameEl) nameEl.textContent = user.displayName || user.email;
  if (photoEl && user.photoURL) {
    photoEl.src = user.photoURL;
    photoEl.style.display = 'block';
  }
});

// ── LOGOUT ────────────────────────────────────────
// Panggil fungsi ini dari tombol logout di HTML
window.logout = async function () {
  try {
    await signOut(auth);
    localStorage.removeItem('dk_theme'); // opsional, biar fresh
    window.location.href = 'login.html';
  } catch (err) {
    console.error('Logout gagal:', err);
  }
};
