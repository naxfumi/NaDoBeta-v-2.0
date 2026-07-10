// ══════════════════════════════════════════════════ 
// FIREBASE / FIRESTORE
// ══════════════════════════════════════════════════ 
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  writeBatch
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDEqRjayX6uok6UIDka1Py7lMhURpvGaMw",
  authDomain: "nadomped.firebaseapp.com",
  projectId: "nadomped",
  storageBucket: "nadomped.firebasestorage.app",
  messagingSenderId: "813627030723",
  appId: "1:813627030723:web:fcf98b72570331a981f676",
  measurementId: "G-NEPG2RCJ8R"
};

const fbApp = initializeApp(firebaseConfig);
const auth  = getAuth(fbApp);
const db    = getFirestore(fbApp);

let uid = null; // diisi setelah auth ready

window.logout = async function () {
  await signOut(auth);
  window.location.replace('login.html');
};

// ══════════════════════════════════════════════════
// ICON LIBRARY
// ══════════════════════════════════════════════════
const ICONS = {
  wallet:     '<rect x="2" y="6" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M6 14h4"/>',
  card:       '<rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>',
  bank:       '<line x1="3" y1="21" x2="21" y2="21"/><line x1="5" y1="21" x2="5" y2="10"/><line x1="19" y1="21" x2="19" y2="10"/><polygon points="12 3 21 9 3 9"/>',
  cash:       '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 10v.01M18 14v.01"/>',
  qr:         '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><line x1="14" y1="14" x2="14" y2="21"/><line x1="21" y1="14" x2="21" y2="14.01"/><line x1="14" y1="17.5" x2="17.5" y2="17.5"/><line x1="21" y1="21" x2="21" y2="21.01"/><line x1="17.5" y1="21" x2="17.5" y2="21.01"/>',
  building:   '<rect x="4" y="2" width="16" height="20" rx="1"/><line x1="9" y1="7" x2="9" y2="7.01"/><line x1="15" y1="7" x2="15" y2="7.01"/><line x1="9" y1="12" x2="9" y2="12.01"/><line x1="15" y1="12" x2="15" y2="12.01"/><line x1="9" y1="17" x2="15" y2="17"/>',
  piggy:      '<path d="M19 9V6a2 2 0 0 0-2-2H9.5a4.5 4.5 0 0 0-4.5 4.5V9"/><path d="M3 11h2"/><path d="M19 9c1.66 0 3 1.34 3 3v1h-3"/><rect x="3" y="9" width="16" height="9" rx="3"/><circle cx="14" cy="13.5" r="1"/><path d="M7 18v2M13 18v2"/>',
  smartphone: '<rect x="6" y="2" width="12" height="20" rx="2"/><line x1="11" y1="18" x2="13" y2="18"/>',
  food:       '<path d="M3 2v7c0 1.1.9 2 2 2h0a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>',
  car:        '<path d="M5 17H3v-6l2-5h12l4 5v6h-2"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/><line x1="10" y1="17.5" x2="15" y2="17.5"/>',
  bag:        '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  gamepad:    '<line x1="6" y1="11" x2="10" y2="11"/><line x1="8" y1="9" x2="8" y2="13"/><line x1="15" y1="12" x2="15.01" y2="12"/><line x1="18" y1="10" x2="18.01" y2="10"/><rect x="2" y="6" width="20" height="12" rx="6"/>',
  bolt:       '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  pill:       '<path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/>',
  phone:      '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.68 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.32 1.85.55 2.81.68A2 2 0 0 1 22 16.92z"/>',
  book:       '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
  sparkle:    '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/>',
  dumbbell:   '<path d="M6.5 6.5 17.5 17.5"/><path d="m21 21-1.5-1.5M3 3l1.5 1.5"/><path d="m18 6 2.5-2.5a1.5 1.5 0 0 0-2-2L16 4"/><path d="m6 18-2.5 2.5a1.5 1.5 0 0 1-2-2L4 16"/><path d="m21 7-3-3M3 17l3 3"/><path d="m14 4 6 6"/><path d="m4 14 6 6"/>',
  box:        '<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>',
  briefcase:  '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  gift:       '<polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>',
  trending:   '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
  store:      '<path d="M2 7l1.5-4h17L22 7"/><path d="M2 7h20v13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7z"/><path d="M9 21V12h6v9"/>',
  inbox:      '<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
  flame:      '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  layers:     '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
  chart:      '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
  more:       '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
};
const ICON_KEYS = Object.keys(ICONS);

function svgIcon(key, size = 16) {
  const path = ICONS[key] || ICONS.more;
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
}

// ══════════════════════════════════════════════════
// STORAGE
// ══════════════════════════════════════════════════
const KEYS = {
  tx: 'dk_tx_v4',
  wallets: 'dk_wallets_v4',
  cats: 'dk_cats_v4',
  theme: 'dk_theme',
  lastWallet: 'dk_last_wallet',
  hideBalance: 'dk_hide_balance',
};

const DEFAULT_WALLETS = [
  { id:'dana',     icon:'smartphone', name:'Dana',       color:'#0A84FF' },
  { id:'shopee',   icon:'bag',        name:'ShopeePay',  color:'#FF9F0A' },
  { id:'gopay',    icon:'qr',         name:'GoPay',      color:'#30D158' },
  { id:'ovo',      icon:'card',       name:'OVO',        color:'#BF5AF2' },
  { id:'bca',      icon:'bank',       name:'BCA',        color:'#0A84FF' },
  { id:'bni',      icon:'building',   name:'BNI',        color:'#FF9F0A' },
  { id:'mandiri',  icon:'briefcase',  name:'Mandiri',    color:'#5E5CE6' },
  { id:'tunai',    icon:'cash',       name:'Tunai',      color:'#30D158' },
];

const DEFAULT_CATS_OUT = [
  { id:'makan',      icon:'food',      name:'Makan' },
  { id:'transport',  icon:'car',       name:'Transport' },
  { id:'belanja',    icon:'bag',       name:'Belanja' },
  { id:'hiburan',    icon:'gamepad',   name:'Hiburan' },
  { id:'tagihan',    icon:'bolt',      name:'Tagihan' },
  { id:'kesehatan',  icon:'pill',      name:'Kesehatan' },
  { id:'pulsa',      icon:'phone',     name:'Pulsa' },
  { id:'pendidikan', icon:'book',      name:'Pendidikan' },
  { id:'kecantikan', icon:'sparkle',   name:'Kecantikan' },
  { id:'olahraga',   icon:'dumbbell',  name:'Olahraga' },
  { id:'lainnya',    icon:'box',       name:'Lainnya' },
];

const DEFAULT_CATS_IN = [
  { id:'gaji',       icon:'briefcase', name:'Gaji' },
  { id:'freelance',  icon:'sparkle',   name:'Freelance' },
  { id:'transfer',   icon:'bank',      name:'Transfer' },
  { id:'hadiah',     icon:'gift',      name:'Hadiah' },
  { id:'investasi',  icon:'trending',  name:'Investasi' },
  { id:'bisnis',     icon:'store',     name:'Bisnis' },
  { id:'lainnya_in', icon:'box',       name:'Lainnya' },
];

// ══════════════════════════════════════════════════
// STATE — data kosong dulu, diisi dari Firestore setelah login
// ══════════════════════════════════════════════════
let transactions = [];
let wallets      = [];
let catsOut      = [];
let catsIn       = [];
let isDark       = localStorage.getItem(KEYS.theme) !== 'light';
let isBalanceHidden = localStorage.getItem(KEYS.hideBalance) === 'true';
let currentType  = 'out';
let currentWallet = localStorage.getItem(KEYS.lastWallet) || '';
let currentCat   = '';
let chartPeriod  = 'week';
let filterWallet = 'all';
let catTab       = 'out';
let chartLine    = null;
let chartDonut   = null;
let pendingDeleteFn = null;
let pickerNewWalletIcon = 'wallet';
let pickerNewCatIcon = 'box';
let editingWalletId = null;
let editingCatId = null;
let transferFromWallet = null;
let transferToWallet = null;

// ══════════════════════════════════════════════════
// FIRESTORE HELPERS
// ══════════════════════════════════════════════════
function userCol(name) {
  return collection(db, 'users', uid, name);
}

async function fetchAll() {
  const [txSnap, walSnap, catSnap] = await Promise.all([
    getDocs(userCol('transactions')),
    getDocs(userCol('wallets')),
    getDocs(userCol('categories')),
  ]);

  transactions = txSnap.docs.map(d => ({ id: d.id, ...d.data() }))
    .sort((a,b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));

  wallets = walSnap.docs.map(d => ({ id: d.id, ...d.data() }));
  if (wallets.length === 0) {
    wallets = DEFAULT_WALLETS;
    await Promise.all(wallets.map(w => setDoc(doc(userCol('wallets'), w.id), w)));
  }

  const allCats = catSnap.docs.map(d => ({ id: d.id, ...d.data() }));
  catsOut = allCats.filter(c => c.type === 'out').map(({type, ...c}) => c);
  catsIn  = allCats.filter(c => c.type === 'in').map(({type, ...c}) => c);

  if (catsOut.length === 0 && catsIn.length === 0) {
    catsOut = DEFAULT_CATS_OUT;
    catsIn  = DEFAULT_CATS_IN;
    await Promise.all([
      ...catsOut.map(c => setDoc(doc(userCol('categories'), 'out_'+c.id), { ...c, type:'out' })),
      ...catsIn.map(c => setDoc(doc(userCol('categories'), 'in_'+c.id), { ...c, type:'in' })),
    ]);
  }

  if (!currentWallet || !wallets.find(w => w.id === currentWallet)) {
    currentWallet = wallets[0]?.id || '';
  }
}

function getWalletBalance(walletId) {
  return transactions.reduce((sum, tx) => {
    if (tx.wallet !== walletId) return sum;
    if (tx.type === 'in' || tx.type === 'transfer_in') return sum + tx.amount;
    if (tx.type === 'out' || tx.type === 'transfer_out') return sum - tx.amount;
    return sum;
  }, 0);
}
// ══════════════════════════════════════════════════
// FORMAT
// ══════════════════════════════════════════════════
function fmt(n) {
  const abs = Math.abs(n);
  if (abs >= 1e9) return 'Rp ' + (abs/1e9).toFixed(1) + 'M';
  if (abs >= 1e6) return 'Rp ' + (abs/1e6).toFixed(1) + 'jt';
  return 'Rp ' + abs.toLocaleString('id-ID');
}
function fmtFull(n) { return 'Rp ' + Math.abs(n).toLocaleString('id-ID'); }
function fmtDate(d) { return new Date(d).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'}); }
function today() { return new Date().toISOString().slice(0,10); }

// Group label like "Hari Ini", "Kemarin", or formatted date
function dateGroupLabel(dateStr) {
  const d = today();
  const y = new Date(); y.setDate(y.getDate()-1);
  const yStr = y.toISOString().slice(0,10);
  if (dateStr === d) return 'Hari Ini';
  if (dateStr === yStr) return 'Kemarin';
  return new Date(dateStr).toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long'});
}
// ══════════════════════════════════════════════════
// THEME
// ══════════════════════════════════════════════════
const SUN_ICON = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>';
const MOON_ICON = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';

function applyTheme() {
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  const iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${isDark ? MOON_ICON : SUN_ICON}</svg>`;
  const themeText = isDark ? 'Mode Gelap' : 'Mode Terang';

  // Sidebar (desktop)
  const labelSidebar = document.getElementById('themeLabelSidebar');
  if (labelSidebar) labelSidebar.innerHTML = `${iconSvg} ${themeText}`;
  const toggleSidebar = document.getElementById('themeToggleSidebar');
  if (toggleSidebar) toggleSidebar.className = 'theme-toggle' + (isDark ? '' : ' on');

  // Akun page
  const label = document.getElementById('themeLabel');
  if (label) label.innerHTML = `${iconSvg} ${themeText}`;
  const toggle = document.getElementById('themeToggle');
  if (toggle) toggle.className = 'theme-toggle' + (isDark ? '' : ' on');

  const mobileBtn = document.getElementById('mobileThemeBtn');
  if (mobileBtn) mobileBtn.innerHTML = iconSvg;

  localStorage.setItem(KEYS.theme, isDark ? 'dark' : 'light');
  if (chartLine) renderLineChart();
  if (chartDonut) renderStats();
}
function toggleTheme() { isDark = !isDark; applyTheme(); }

const EYE_OPEN = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
const EYE_CLOSED = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>';

function toggleBalanceVisibility() {
  isBalanceHidden = !isBalanceHidden;
  localStorage.setItem(KEYS.hideBalance, isBalanceHidden);
  const icon = document.getElementById('hideBalanceIcon');
  if (icon) icon.innerHTML = isBalanceHidden ? EYE_CLOSED : EYE_OPEN;
  renderDashboard();
}

// ══════════════════════════════════════════════════
// NAVIGATION
// ══════════════════════════════════════════════════
const PAGE_TITLES = { dashboard:'Beranda', tambah:'Catat Transaksi', riwayat:'Riwayat', statistik:'Statistik', akun:'Akun' };

function navTo(page, btn) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item, .mobile-nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');

  document.querySelectorAll(`[onclick*="navTo('${page}'"]`).forEach(b => b.classList.add('active'));
  if (btn) btn.classList.add('active');

  document.getElementById('topbarTitle').textContent = PAGE_TITLES[page] || '';

  if (page === 'dashboard') renderDashboard();
  if (page === 'riwayat') renderHistory();
  if (page === 'statistik') renderStats();
  if (page === 'akun') renderAccountIdentity();
  if (page === 'tambah') initTambahForm();
}

// ══════════════════════════════════════════════════
// AKUN — identity card + advanced settings modal
// ══════════════════════════════════════════════════
function renderAccountIdentity() {
  const user = auth.currentUser;
  if (!user) return;

  const nameEl  = document.getElementById('accountName');
  const emailEl = document.getElementById('accountEmail');
  const avaEl   = document.getElementById('accountAvatar');
  const mobileAvaEl = document.getElementById('mobileAvatarBtn');
  const sidebarAvaEl = document.getElementById('sidebarAvatar');
  const sidebarNameEl = document.getElementById('sidebarAccountName');

  const initial = (user.displayName || user.email || '?').trim().charAt(0).toUpperCase();
  const avatarHTML = user.photoURL ? `<img src="${user.photoURL}" alt="Avatar">` : initial;

  if (nameEl)  nameEl.textContent  = user.displayName || 'Pengguna';
  if (emailEl) emailEl.textContent = user.email || '';
  if (avaEl)   avaEl.innerHTML     = avatarHTML;
  if (mobileAvaEl)  mobileAvaEl.innerHTML  = avatarHTML;
  if (sidebarAvaEl) sidebarAvaEl.innerHTML = avatarHTML;
  if (sidebarNameEl) sidebarNameEl.textContent = user.displayName || 'Pengguna';
}

function openAdvancedSettings() {
  document.getElementById('advancedSettingsOverlay').classList.add('open');
  renderSettings();
}
function closeAdvancedSettings() {
  document.getElementById('advancedSettingsOverlay').classList.remove('open');
}
// ══════════════════════════════════════════════════
// TAMBAH FORM — new flow
// ══════════════════════════════════════════════════
function initTambahForm() {
  buildCatPicker();
  buildWalletChip();
  buildWalletPickerPop();
  document.getElementById('inputDate').value = today();
  document.getElementById('inputDesc').value = '';
  document.getElementById('inputAmount').value = '';
  // Auto-focus amount only on larger screens (avoids unwanted keyboard pop on mobile nav transition)
  if (window.innerWidth > 768) {
    setTimeout(() => document.getElementById('inputAmount').focus(), 50);
  }
}

function setType(t, btn) {
  currentType = t;
  document.getElementById('btnOut').className = 'type-btn' + (t === 'out' ? ' active-out' : '');
  document.getElementById('btnIn').className  = 'type-btn' + (t === 'in'  ? ' active-in'  : '');
  document.getElementById('btnTransfer').className = 'type-btn' + (t === 'transfer' ? ' active-out' : '');

  const isTransfer = t === 'transfer';
  document.getElementById('categorySection').style.display = isTransfer ? 'none' : 'block';
  document.getElementById('transferSection').style.display = isTransfer ? 'block' : 'none';
  document.getElementById('walletChipRow').style.display = isTransfer ? 'none' : 'block';

  if (isTransfer) {
    transferFromWallet = wallets[0]?.id || null;
    transferToWallet = wallets[1]?.id || wallets[0]?.id || null;
    buildTransferPickers();
  } else {
    currentCat = '';
    buildCatPicker();
  }
}

function buildTransferPickers() {
  updateTransferChip('from');
  updateTransferChip('to');
  buildTransferPickerPop('from');
  buildTransferPickerPop('to');
}

function updateTransferChip(which) {
  const walletId = which === 'from' ? transferFromWallet : transferToWallet;
  const w = wallets.find(w => w.id === walletId);
  if (!w) return;

  const iconEl = document.getElementById(which === 'from' ? 'transferFromChipIcon' : 'transferToChipIcon');
  const nameEl = document.getElementById(which === 'from' ? 'transferFromChipName' : 'transferToChipName');

  iconEl.style.background = w.color + '1F';
  iconEl.style.color = w.color;
  iconEl.innerHTML = svgIcon(w.icon, 14);
  nameEl.textContent = w.name;
}

function buildTransferPickerPop(which) {
  const pop = document.getElementById(which === 'from' ? 'transferFromPicker' : 'transferToPicker');
  const selectedId = which === 'from' ? transferFromWallet : transferToWallet;

  pop.innerHTML = wallets.map(w => `
    <button type="button" class="wallet-opt ${selectedId === w.id ? 'sel' : ''}" onclick="selTransferWallet('${which}','${w.id}')">
      <span class="wo-icon" style="background:${w.color}1F;color:${w.color}">${svgIcon(w.icon, 13)}</span>
      <span class="wo-label">${w.name}</span>
    </button>`).join('');
}

function toggleTransferPicker(which) {
  const popId = which === 'from' ? 'transferFromPicker' : 'transferToPicker';
  const otherPopId = which === 'from' ? 'transferToPicker' : 'transferFromPicker';
  document.getElementById(otherPopId).classList.remove('open');
  document.getElementById(popId).classList.toggle('open');
}

function selTransferWallet(which, id) {
  if (which === 'from') transferFromWallet = id;
  else transferToWallet = id;
  buildTransferPickers();
  document.getElementById(which === 'from' ? 'transferFromPicker' : 'transferToPicker').classList.remove('open');
}

// Category grid — shown first
function buildCatPicker() {
  const cats = currentType === 'out' ? catsOut : catsIn;
  if (!currentCat || !cats.find(c => c.id === currentCat)) currentCat = cats[0]?.id;
  const el = document.getElementById('catPicker');
  el.innerHTML = cats.map(c => `
    <button type="button" class="cat-opt ${currentCat === c.id ? 'sel' : ''}" onclick="selCat('${c.id}',this)">
      <span class="co-icon" style="background:var(--surface);color:var(--text2)">${svgIcon(c.icon, 13)}</span>
      <span class="co-label">${c.name}</span>
    </button>`).join('');
}
function selCat(id, btn) {
  currentCat = id;
  document.querySelectorAll('.cat-opt').forEach(b => b.classList.remove('sel'));
  btn.classList.add('sel');
}

// Wallet chip — shows current (default: last used), tap opens inline picker
function buildWalletChip() {
  if (!currentWallet || !wallets.find(w => w.id === currentWallet)) currentWallet = wallets[0]?.id;
  const w = wallets.find(w => w.id === currentWallet);
  if (!w) return;
  document.getElementById('walletChipIcon').style.background = w.color + '1F';
  document.getElementById('walletChipIcon').style.color = w.color;
  document.getElementById('walletChipIcon').innerHTML = svgIcon(w.icon, 14);
  document.getElementById('walletChipName').textContent = w.name;
}

function buildWalletPickerPop() {
  const pop = document.getElementById('walletPickerPop');
  pop.innerHTML = wallets.map(w => `
    <button type="button" class="wallet-opt ${currentWallet === w.id ? 'sel' : ''}" onclick="selWallet('${w.id}')">
      <span class="wo-icon" style="background:${w.color}1F;color:${w.color}">${svgIcon(w.icon, 13)}</span>
      <span class="wo-label">${w.name}</span>
    </button>`).join('');
}

function toggleWalletPicker() {
  document.getElementById('walletPickerPop').classList.toggle('open');
}

function selWallet(id) {
  currentWallet = id;
  localStorage.setItem(KEYS.lastWallet, id);
  buildWalletChip();
  buildWalletPickerPop();
  document.getElementById('walletPickerPop').classList.remove('open');
}

// Collapsible "catatan & tanggal"
function toggleMoreOptions() {
  document.getElementById('moreToggle').classList.toggle('open');
  document.getElementById('moreOptionsPanel').classList.toggle('open');
}

// ── Amount auto-formatting with thousand separators (id-ID locale) ──
const amountFmt = new Intl.NumberFormat('id-ID');

function rawAmountValue() {
  const input = document.getElementById('inputAmount');
  return parseInt(input.value.replace(/\D/g, ''), 10) || 0;
}

document.addEventListener('input', e => {
  if (e.target && e.target.id === 'inputAmount') {
    const digits = e.target.value.replace(/\D/g, '');
    e.target.value = digits ? amountFmt.format(parseInt(digits, 10)) : '';
  }
});

async function saveTransaction() {
  if (currentType === 'transfer') {
    await saveTransfer();
    return;
  }

  const amount = rawAmountValue();
  const desc   = document.getElementById('inputDesc').value.trim();
  const date   = document.getElementById('inputDate').value || today();

  if (!currentCat) { toast('Pilih kategori dulu', 'warn'); return; }
  if (!amount || amount <= 0) { toast('Masukkan jumlah dulu', 'warn'); return; }

  if (currentType === 'out') {
    const saldo = getWalletBalance(currentWallet);
    if (amount > saldo) {
      const w = wallets.find(w => w.id === currentWallet);
      toast(`Saldo ${w?.name || 'dompet'} tidak cukup (${fmtFull(saldo)})`, 'error');
      return;
    }
  }

  const txId = String(Date.now());
  const txData = { type: currentType, amount, desc, wallet: currentWallet, cat: currentCat, date };

  try {
    await setDoc(doc(userCol('transactions'), txId), txData);
    transactions.unshift({ id: txId, ...txData });

    resetTambahForm();
    toast('Transaksi tersimpan', 'success');
    setTimeout(() => navTo('dashboard', document.querySelector('.mobile-nav-btn[data-page=dashboard], .nav-item[onclick*="dashboard"]')), 450);
  } catch (err) {
    console.error(err);
    toast('Gagal menyimpan, cek koneksi', 'error');
  }
}

async function saveTransfer() {
  const amount = rawAmountValue();
  const desc   = document.getElementById('inputDesc').value.trim();
  const date   = document.getElementById('inputDate').value || today();

  if (!amount || amount <= 0) { toast('Masukkan jumlah dulu', 'warn'); return; }
  if (!transferFromWallet || !transferToWallet) { toast('Pilih dompet asal dan tujuan', 'warn'); return; }
  if (transferFromWallet === transferToWallet) { toast('Dompet asal dan tujuan tidak boleh sama', 'warn'); return; }

  const saldo = getWalletBalance(transferFromWallet);
  if (amount > saldo) {
    const w = wallets.find(w => w.id === transferFromWallet);
    toast(`Saldo ${w?.name || 'dompet'} tidak cukup (${fmtFull(saldo)})`, 'error');
    return;
  }

  const transferId = String(Date.now());
  const txOutId = transferId + '_out';
  const txInId  = transferId + '_in';

  const wFrom = wallets.find(w => w.id === transferFromWallet);
  const wTo   = wallets.find(w => w.id === transferToWallet);

  const txOutData = {
    type: 'transfer_out',
    amount,
    desc: desc || `Transfer ke ${wTo?.name || 'dompet lain'}`,
    wallet: transferFromWallet,
    cat: '',
    date,
    transferId,
    transferPeer: transferToWallet,
  };
  const txInData = {
    type: 'transfer_in',
    amount,
    desc: desc || `Transfer dari ${wFrom?.name || 'dompet lain'}`,
    wallet: transferToWallet,
    cat: '',
    date,
    transferId,
    transferPeer: transferFromWallet,
  };

  try {
    await Promise.all([
      setDoc(doc(userCol('transactions'), txOutId), txOutData),
      setDoc(doc(userCol('transactions'), txInId), txInData),
    ]);
    transactions.unshift({ id: txInId, ...txInData });
    transactions.unshift({ id: txOutId, ...txOutData });

    resetTambahForm();
    toast('Transfer berhasil', 'success');
    setTimeout(() => navTo('dashboard', document.querySelector('.mobile-nav-btn[data-page=dashboard], .nav-item[onclick*="dashboard"]')), 450);
  } catch (err) {
    console.error(err);
    toast('Gagal transfer, cek koneksi', 'error');
  }
}

function resetTambahForm() {
  document.getElementById('inputAmount').value = '';
  document.getElementById('inputDesc').value   = '';
  document.getElementById('inputDate').value   = today();
  document.getElementById('moreOptionsPanel').classList.remove('open');
  document.getElementById('moreToggle').classList.remove('open');
  if (currentType !== 'transfer') {
    localStorage.setItem(KEYS.lastWallet, currentWallet);
  }
}

// Close wallet picker pop if clicking outside
document.addEventListener('click', e => {
  if (!e.target.closest('.wallet-chip-row')) {
    ['walletPickerPop', 'transferFromPicker', 'transferToPicker'].forEach(id => {
      const pop = document.getElementById(id);
      if (pop) pop.classList.remove('open');
    });
  }
});
// ══════════════════════════════════════════════════
// DASHBOARD
// ══════════════════════════════════════════════════
function renderDashboard() {
  let totalIn = 0, totalOut = 0;
  const walletNet = {};
  wallets.forEach(w => walletNet[w.id] = 0);

  const thisMonth = today().slice(0,7);
  let bulanOut = 0;

  transactions.forEach(tx => {
    const isIn = tx.type === 'in' || tx.type === 'transfer_in';
    const isOut = tx.type === 'out' || tx.type === 'transfer_out';
    const v = isIn ? tx.amount : -tx.amount;

    // Statistik (totalIn/totalOut) HANYA hitung transaksi asli, bukan transfer
    if (tx.type === 'in') totalIn += tx.amount;
    if (tx.type === 'out') totalOut += tx.amount;

    // Saldo per dompet TETAP terpengaruh oleh transfer
    if (walletNet[tx.wallet] !== undefined) walletNet[tx.wallet] += v;

    if (tx.type === 'out' && tx.date?.startsWith(thisMonth)) bulanOut += tx.amount;  
  });

  const net = totalIn - totalOut;
  document.getElementById('heroAmount').textContent = isBalanceHidden ? '••••••••' : fmtFull(net);
  document.getElementById('heroAmount').className   = 'hero-amount' + (net < 0 && !isBalanceHidden ? ' neg' : '');
  document.getElementById('heroIn').textContent     = isBalanceHidden ? '••••••' : fmt(totalIn);
  document.getElementById('heroOut').textContent    = isBalanceHidden ? '••••••' : fmt(totalOut);
  document.getElementById('heroBulan').textContent  = isBalanceHidden ? '••••••' : fmt(bulanOut);

  document.getElementById('walletGrid').innerHTML = wallets.map(w => {
    const bal = walletNet[w.id] || 0;
    const balDisplay = isBalanceHidden ? '••••••' : `${bal < 0 ? '−' : ''}${fmtFull(bal)}`;
    return `
      <div class="wallet-card" onclick="navTo('riwayat',null);setFilterWallet('${w.id}')">
      <div class="wallet-card-icon" style="background:${w.color}1F;color:${w.color}">${svgIcon(w.icon, 14)}</div>
      <div class="wallet-card-name">${w.name}</div>
      <div class="wallet-card-balance" style="color:${(bal < 0 && !isBalanceHidden) ? 'var(--red)' : 'var(--text)'}">${balDisplay}</div>
    </div>`;
  }).join('');

  renderLineChart();

  const recent = transactions.slice(0, 6);
  document.getElementById('recentList').innerHTML = recent.length
    ? renderGroupedTx(recent, false)
    : emptyHTML('inbox','Belum ada transaksi','Tap tombol Tambah untuk mulai mencatat');
}

// ══════════════════════════════════════════════════
// CHART — animations disabled per request, kept minimal/flat
// ══════════════════════════════════════════════════
function renderLineChart() {
  const days = chartPeriod === 'week' ? 7 : 30;
  const labels = [], dataOut = [], dataIn = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0,10);
    labels.push(d.toLocaleDateString('id-ID',{day:'numeric',month:'short'}));
    dataOut.push(transactions.filter(tx => tx.date===key && tx.type==='out').reduce((s,t)=>s+t.amount,0));
    dataIn.push(transactions.filter(tx => tx.date===key && tx.type==='in').reduce((s,t)=>s+t.amount,0));
  }

  if (chartLine) chartLine.destroy();
  const ctx = document.getElementById('chartLine').getContext('2d');
  const greenColor  = getComputedStyle(document.documentElement).getPropertyValue('--green').trim() || '#30D158';
  const gridCol = isDark ? '#232325' : '#E5E5EA';
  const tickCol = isDark ? '#636366' : '#AEAEB2';
  const lineOutColor = isDark ? '#F5F5F7' : '#1C1C1E';

  chartLine = new Chart(ctx, {
    type: 'line',
    data: { labels, datasets: [
      { label:'Pengeluaran', data:dataOut, borderColor:lineOutColor, backgroundColor:'transparent', borderWidth:2, pointRadius:0, pointHoverRadius:3, tension:0, fill:false },
      { label:'Pemasukan',   data:dataIn,  borderColor:greenColor,  backgroundColor:'transparent', borderWidth:2, pointRadius:0, pointHoverRadius:3, tension:0, fill:false }
    ]},
    options: {
      animation: false,
      plugins: { legend: { labels: { color: tickCol, font:{size:11,family:'Inter'}, boxWidth:8, padding:14, usePointStyle:true, pointStyle:'circle' } } },
      scales: {
        x: { grid:{display:false}, ticks:{color:tickCol,font:{size:10}} },
        y: { grid:{color:gridCol}, ticks:{color:tickCol,font:{size:10}, callback: v => v>=1e6?(v/1e6).toFixed(1)+'jt':v>=1e3?(v/1e3)+'rb':v} }
      },
      responsive:true, maintainAspectRatio:true,
    }
  });
}

function setPeriod(p, btn) {
  chartPeriod = p;
  document.querySelectorAll('.period-tab').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderLineChart();
}

// ══════════════════════════════════════════════════
// HISTORY — grouped by date
// ══════════════════════════════════════════════════
function renderHistory() {
  const chips = document.getElementById('filterChips');
  const all = [{ id:'all', icon:'layers', name:'Semua' }, ...wallets];
  chips.innerHTML = all.map(w => `
    <button class="filter-chip ${filterWallet===w.id?'active':''}" onclick="setFilterWallet('${w.id}')">${svgIcon(w.icon,13)} ${w.name}</button>
  `).join('') + `
    <button class="filter-chip ${filterWallet==='out'?'active':''}" onclick="setFilterWallet('out')">${svgIcon('trending',13)} Pengeluaran</button>
    <button class="filter-chip ${filterWallet==='in'?'active':''}" onclick="setFilterWallet('in')">${svgIcon('trending',13)} Pemasukan</button>
  `;

  const q = document.getElementById('searchInput').value.toLowerCase();
  let filtered = transactions;
  if (filterWallet === 'out') filtered = filtered.filter(tx => tx.type === 'out');
  else if (filterWallet === 'in') filtered = filtered.filter(tx => tx.type === 'in');
  else if (filterWallet !== 'all') filtered = filtered.filter(tx => tx.wallet === filterWallet);
  if (q) {
    const allCatsForSearch = [...catsOut, ...catsIn];
    filtered = filtered.filter(tx => {
      const catName = (allCatsForSearch.find(c => c.id === tx.cat)?.name || '').toLowerCase();
      const walletName = (wallets.find(w => w.id === tx.wallet)?.name || '').toLowerCase();
      const descText = (tx.desc || '').toLowerCase();
      return descText.includes(q) || catName.includes(q) || walletName.includes(q);
    });
  }
  document.getElementById('historyList').innerHTML = filtered.length
    ? renderGroupedTx(filtered, true)
    : emptyHTML('inbox','Tidak ada transaksi','Coba ubah filter atau kata kunci pencarian');
}

function setFilterWallet(id) {
  filterWallet = id;
  if (document.getElementById('page-riwayat').classList.contains('active')) renderHistory();
}

// Render a transaction list grouped under date headers
function renderGroupedTx(list, showDel) {
  const groups = {};
  const order = [];
  list.forEach(tx => {
    if (!groups[tx.date]) { groups[tx.date] = []; order.push(tx.date); }
    groups[tx.date].push(tx);
  });
  // order is already roughly chronological since transactions are unshifted (newest first);
  // sort group keys descending just to be safe
  order.sort((a,b) => b.localeCompare(a));

  return order.map(dateKey => `
    <div class="tx-group">
      <div class="tx-group-label">${dateGroupLabel(dateKey)}</div>
      <div class="tx-list">
        ${groups[dateKey].map(tx => txHTML(tx, showDel)).join('')}
      </div>
    </div>
  `).join('');
}
// ══════════════════════════════════════════════════
// STATS
// ══════════════════════════════════════════════════
function renderStats() {
  const todayStr = today();
  const thisMonth = todayStr.slice(0,7);

  const out = transactions.filter(tx => tx.type === 'out');
  const bulan = out.filter(tx => tx.date?.startsWith(thisMonth)).reduce((s,t)=>s+t.amount,0);
  const hari  = out.filter(tx => tx.date === todayStr).reduce((s,t)=>s+t.amount,0);
  const maks  = out.length ? Math.max(...out.map(t=>t.amount)) : 0;
  const days  = new Set(out.map(t=>t.date)).size || 1;
  const rata  = out.reduce((s,t)=>s+t.amount,0) / days;

  const statDefs = [
    { label:'Pengeluaran Bulan Ini', value: fmt(bulan), icon:'chart',    sub: thisMonth },
    { label:'Pengeluaran Hari Ini',  value: fmt(hari),  icon:'bolt',     sub: fmtDate(todayStr) },
    { label:'Transaksi Terbesar',    value: fmt(maks),  icon:'flame',    sub: 'single transaksi' },
    { label:'Rata-rata per Hari',    value: fmt(rata),  icon:'trending', sub: `dari ${days} hari aktif` },
  ];
  document.getElementById('statsTop').innerHTML = statDefs.map(s => `
    <div class="card stat-card">
      <div class="stat-card-icon">${svgIcon(s.icon, 15)}</div>
      <div class="stat-card-label">${s.label}</div>
      <div class="stat-card-value">${s.value}</div>
      <div class="stat-card-sub">${s.sub}</div>
    </div>`).join('');

  const catMap = {};
  out.forEach(tx => { catMap[tx.cat] = (catMap[tx.cat]||0) + tx.amount; });
  const sorted = Object.entries(catMap).sort((a,b)=>b[1]-a[1]);
  const total  = sorted.reduce((s,[,v])=>s+v,0) || 1;
  const allCats = [...catsOut, ...catsIn];

  renderDonut(sorted, allCats);

  document.getElementById('catBarList').innerHTML = sorted.slice(0,8).map(([k,v]) => {
    const cat = allCats.find(c=>c.id===k)||{icon:'box',name:k};
    const pct = Math.round(v/total*100);
    return `
      <div class="cat-bar-item">
        <div class="cat-bar-icon">${svgIcon(cat.icon, 14)}</div>
        <div class="cat-bar-info">
          <div class="cat-bar-name">
            <span class="cat-bar-name-text">${cat.name}</span>
            <span class="cat-bar-name-pct">${pct}%</span>
          </div>
          <div class="cat-bar-track"><div class="cat-bar-fill" style="width:${pct}%"></div></div>
        </div>
        <div class="cat-bar-amount">${fmt(v)}</div>
      </div>`;
  }).join('') || emptyHTML('chart','Belum ada data','Tambah transaksi pengeluaran dulu');
}

function renderDonut(sorted, allCats) {
  if (chartDonut) chartDonut.destroy();
  if (!sorted || sorted.length === 0) return;
  const COLORS = isDark
    ? ['#0A84FF','#5E5CE6','#BF5AF2','#30D158','#FF9F0A','#64D2FF','#FF453A','#FFD60A','#A2845E']
    : ['#0A84FF','#5E5CE6','#AF52DE','#34C759','#FF9500','#32ADE6','#FF3B30','#FFCC00','#A2845E'];
  const ctx = document.getElementById('chartDonut').getContext('2d');
  const tickCol = isDark ? '#98989D' : '#6E6E73';
  chartDonut = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: sorted.map(([k]) => (allCats.find(c=>c.id===k)||{name:k}).name),
      datasets: [{ data: sorted.map(([,v])=>v), backgroundColor: COLORS, borderWidth: 0, hoverOffset: 4 }]
    },
    options: {
      animation: false,
      plugins: { legend: { position:'bottom', labels: { color: tickCol, font:{size:11,family:'Inter'}, padding:12, boxWidth:9, usePointStyle:true, pointStyle:'circle' } } },
      cutout: '70%',
      responsive: true, maintainAspectRatio: true,
    }
  });
}

// ══════════════════════════════════════════════════
// SETTINGS
// ══════════════════════════════════════════════════
function renderSettings() {
  renderWalletList();
  renderCatList();
  buildIconPickerPop('wallet');
  buildIconPickerPop('cat');
  setIconBtnPreview('wallet', pickerNewWalletIcon);
  setIconBtnPreview('cat', pickerNewCatIcon);
}

function renderWalletList() {
  document.getElementById('walletList').innerHTML = wallets.map(w => `
    <div class="item-row">
      <span class="item-row-icon" style="background:${w.color}1F;color:${w.color}">${svgIcon(w.icon,15)}</span>
      <div>
        <div class="item-row-name">${w.name}</div>
        <div class="item-row-sub" style="display:flex;align-items:center;gap:4px"><span style="width:7px;height:7px;border-radius:50%;background:${w.color};display:inline-block"></span> ${w.color}</div>
      </div>
      <button class="item-row-edit" onclick="editWallet('${w.id}')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"/></svg></button>
      <button class="item-row-del" onclick="deleteWallet('${w.id}')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>`).join('');
}

async function addWallet() {
  const icon  = pickerNewWalletIcon || 'wallet';
  const name  = document.getElementById('newWalletName').value.trim();
  const color = document.getElementById('newWalletColor').value;
  if (!name) { toast('Isi nama dompet dulu','warn'); return; }

  try {
    if (editingWalletId) {
      // Mode edit — update dokumen yang sudah ada
      await setDoc(doc(userCol('wallets'), editingWalletId), { icon, name, color });
      const idx = wallets.findIndex(w => w.id === editingWalletId);
      if (idx !== -1) wallets[idx] = { id: editingWalletId, icon, name, color };
      toast('Dompet diperbarui','success');
      cancelWalletEdit();
    } else {
      // Mode tambah baru
      const id = 'w_' + Date.now();
      await setDoc(doc(userCol('wallets'), id), { icon, name, color });
      wallets.push({ id, icon, name, color });
      toast('Dompet ditambahkan','success');
    }
    document.getElementById('newWalletName').value = '';
    renderWalletList();
  } catch (err) {
    console.error(err);
    toast('Gagal menyimpan, cek koneksi', 'error');
  }
}

function editWallet(id) {
  const w = wallets.find(w => w.id === id);
  if (!w) return;
  editingWalletId = id;
  pickerNewWalletIcon = w.icon;
  document.getElementById('newWalletName').value = w.name;
  document.getElementById('newWalletColor').value = w.color;
  setIconBtnPreview('wallet', w.icon);
  document.getElementById('addWalletBtn').textContent = 'Simpan Perubahan';
  document.getElementById('cancelWalletEditBtn').style.display = 'inline-flex';
}

function cancelWalletEdit() {
  editingWalletId = null;
  document.getElementById('newWalletName').value = '';
  document.getElementById('newWalletColor').value = '#0A84FF';
  pickerNewWalletIcon = 'wallet';
  setIconBtnPreview('wallet', 'wallet');
  document.getElementById('addWalletBtn').textContent = 'Tambah';
  document.getElementById('cancelWalletEditBtn').style.display = 'none';
}

async function deleteWallet(id) {
  const w = wallets.find(w=>w.id===id);
  openModal('Hapus Dompet', `Hapus dompet <strong>${w?.name}</strong>? Transaksi yang terkait tidak ikut terhapus.`, async () => {
    try {
      await deleteDoc(doc(userCol('wallets'), id));
      wallets = wallets.filter(w=>w.id!==id);
      renderWalletList();
      toast('Dompet dihapus','info');
    } catch (err) {
      console.error(err);
      toast('Gagal menghapus, cek koneksi', 'error');
    }
  });
}

function switchCatTab(t) {
  catTab = t;
  document.getElementById('catTabOut').className = 'filter-chip' + (t==='out'?' active':'');
  document.getElementById('catTabIn').className  = 'filter-chip' + (t==='in' ?' active':'');
  renderCatList();
}

function renderCatList() {
  const cats = catTab === 'out' ? catsOut : catsIn;
  document.getElementById('catList').innerHTML = cats.map(c => `
    <div class="item-row">
      <span class="item-row-icon" style="background:var(--surface);color:var(--text2)">${svgIcon(c.icon,15)}</span>
      <div class="item-row-name">${c.name}</div>
      <button class="item-row-edit" onclick="editCategory('${c.id}')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"/></svg></button>
      <button class="item-row-del" onclick="deleteCat('${c.id}')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>`).join('');
}

async function addCategory() {
  const icon = pickerNewCatIcon || 'box';
  const name = document.getElementById('newCatName').value.trim();
  if (!name) { toast('Isi nama kategori dulu','warn'); return; }

  try {
    if (editingCatId) {
      // Mode edit
      const docId = (catTab === 'out' ? 'out_' : 'in_') + editingCatId;
      await setDoc(doc(userCol('categories'), docId), { icon, name, type: catTab });
      const cats = catTab === 'out' ? catsOut : catsIn;
      const idx = cats.findIndex(c => c.id === editingCatId);
      if (idx !== -1) cats[idx] = { id: editingCatId, icon, name };
      toast('Kategori diperbarui','success');
      cancelCatEdit();
    } else {
      // Mode tambah baru
      const id = 'c_' + Date.now();
      const docId = (catTab === 'out' ? 'out_' : 'in_') + id;
      await setDoc(doc(userCol('categories'), docId), { icon, name, type: catTab });
      const newCat = { id, icon, name };
      if (catTab === 'out') catsOut.push(newCat);
      else catsIn.push(newCat);
      toast('Kategori ditambahkan','success');
    }
    document.getElementById('newCatName').value = '';
    renderCatList();
  } catch (err) {
    console.error(err);
    toast('Gagal menyimpan, cek koneksi', 'error');
  }
}

function editCategory(id) {
  const cats = catTab === 'out' ? catsOut : catsIn;
  const c = cats.find(c => c.id === id);
  if (!c) return;
  editingCatId = id;
  pickerNewCatIcon = c.icon;
  document.getElementById('newCatName').value = c.name;
  setIconBtnPreview('cat', c.icon);
  document.getElementById('addCatBtn').textContent = 'Simpan Perubahan';
  document.getElementById('cancelCatEditBtn').style.display = 'inline-flex';
}

function cancelCatEdit() {
  editingCatId = null;
  document.getElementById('newCatName').value = '';
  pickerNewCatIcon = 'box';
  setIconBtnPreview('cat', 'box');
  document.getElementById('addCatBtn').textContent = 'Tambah';
  document.getElementById('cancelCatEditBtn').style.display = 'none';
}

async function deleteCat(id) {
  const cats = catTab === 'out' ? catsOut : catsIn;
  const c = cats.find(c=>c.id===id);
  const docId = (catTab === 'out' ? 'out_' : 'in_') + id;
  openModal('Hapus Kategori', `Hapus kategori <strong>${c?.name}</strong>?`, async () => {
    try {
      await deleteDoc(doc(userCol('categories'), docId));
      if (catTab === 'out') catsOut = catsOut.filter(c=>c.id!==id);
      else catsIn = catsIn.filter(c=>c.id!==id);
      renderCatList();
      toast('Kategori dihapus','info');
    } catch (err) {
      console.error(err);
      toast('Gagal menghapus, cek koneksi', 'error');
    }
  });
}

function confirmClear() {
  openModal('Hapus Semua Data', 'Semua transaksi akan dihapus permanen dari server dan tidak bisa dikembalikan. Yakin?', async () => {
    toast('Menghapus data di server...', 'info');
    try {
      const txSnap = await getDocs(userCol('transactions'));
      const batch = writeBatch(db);
      txSnap.docs.forEach(d => batch.delete(d.ref));
      await batch.commit();

      transactions = [];
      toast('Semua data dihapus','error');
      renderDashboard();
    } catch (err) {
      console.error(err);
      toast('Gagal menghapus di server, cek koneksi', 'error');
    }
  });
}

function confirmLogout() {
  openModal('Keluar Akun', 'Kamu akan keluar dari NaDomped. Yakin ingin melanjutkan?', () => {
    window.logout();
  });
  document.getElementById('modalConfirmBtn').textContent = 'Ya, Keluar';
}

// ══════════════════════════════════════════════════
// ICON PICKER
// ══════════════════════════════════════════════════
function setIconBtnPreview(kind, iconKey) {
  const btn = document.getElementById(kind === 'wallet' ? 'newWalletIconBtn' : 'newCatIconBtn');
  if (btn) btn.innerHTML = svgIcon(iconKey, 18);
}

function buildIconPickerPop(kind) {
  const pop = document.getElementById(kind === 'wallet' ? 'walletIconPop' : 'catIconPop');
  const current = kind === 'wallet' ? pickerNewWalletIcon : pickerNewCatIcon;
  pop.innerHTML = ICON_KEYS.map(key => `
    <button type="button" class="icon-picker-opt ${key===current?'sel':''}" onclick="selectPickerIcon('${kind}','${key}')">${svgIcon(key,15)}</button>
  `).join('');
}

function selectPickerIcon(kind, key) {
  if (kind === 'wallet') pickerNewWalletIcon = key; else pickerNewCatIcon = key;
  setIconBtnPreview(kind, key);
  buildIconPickerPop(kind);
  toggleIconPicker(kind, true);
}

function toggleIconPicker(kind, forceClose) {
  const pop = document.getElementById(kind === 'wallet' ? 'walletIconPop' : 'catIconPop');
  const otherPop = document.getElementById(kind === 'wallet' ? 'catIconPop' : 'walletIconPop');
  if (otherPop) otherPop.classList.remove('open');
  if (forceClose) { pop.classList.remove('open'); return; }
  pop.classList.toggle('open');
}

document.addEventListener('click', e => {
  if (!e.target.closest('.icon-select-wrap')) {
    document.querySelectorAll('.icon-picker-pop').forEach(p => p.classList.remove('open'));
  }
});

// ══════════════════════════════════════════════════
// MODAL
// ══════════════════════════════════════════════════
function openModal(title, sub, onConfirm) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalSub').innerHTML = sub;
  document.getElementById('modalConfirmBtn').textContent = 'Hapus';
  document.getElementById('modalOverlay').classList.add('open');
  pendingDeleteFn = onConfirm;
  document.getElementById('modalConfirmBtn').onclick = () => { closeModal(); if (pendingDeleteFn) pendingDeleteFn(); };
}
function closeModal() { document.getElementById('modalOverlay').classList.remove('open'); }

// ══════════════════════════════════════════════════
// TX HTML
// ══════════════════════════════════════════════════
function txHTML(tx, showDel = false) {
  const isTransfer = tx.type === 'transfer_out' || tx.type === 'transfer_in';
  const allCats = [...catsOut, ...catsIn];
  const w = wallets.find(w=>w.id===tx.wallet)||{icon:'wallet',name:tx.wallet,color:'#0A84FF'};

  let iconKey, sign, cls, metaText;

  if (isTransfer) {
    const peer = wallets.find(w => w.id === tx.transferPeer);
    iconKey = 'trending'; // ikon panah/transfer
    sign = tx.type === 'transfer_out' ? '−' : '+';
    cls  = tx.type === 'transfer_out' ? 'out' : 'in';
    metaText = tx.type === 'transfer_out'
      ? `Transfer ke ${peer?.name || '—'}`
      : `Transfer dari ${peer?.name || '—'}`;
  } else {
    const cat = allCats.find(c=>c.id===tx.cat)||{icon:'box',name:'Lainnya'};
    iconKey = cat.icon;
    sign = tx.type === 'out' ? '−' : '+';
    cls  = tx.type === 'out' ? 'out' : 'in';
    metaText = `<span class="tx-badge" style="color:${w.color};background:${w.color}1A">${w.name}</span>${cat.name !== 'Lainnya' ? ` · ${cat.name}` : ''}`;
  }

  const displayTitle = tx.desc && tx.desc.trim() ? tx.desc : (isTransfer ? tx.desc : (allCats.find(c=>c.id===tx.cat)?.name || 'Transaksi'));
console.log('desc:', tx.desc, '| displayTitle:', displayTitle);
  return `
    <div class="tx-item">
      <div class="tx-icon" style="background:${w.color}1F;color:${w.color}">${svgIcon(iconKey, 17)}</div>
      <div class="tx-info">
        <div class="tx-desc">${displayTitle}</div>
        <div class="tx-meta">${metaText}</div>
      </div>
      <div class="tx-amount ${cls}">${sign} ${fmtFull(tx.amount)}</div>
      ${showDel ? `<div class="tx-actions"><button class="tx-btn" onclick="deleteTx('${tx.id}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button></div>` : ''}
    </div>`;
}

async function deleteTx(id) {
  const tx = transactions.find(t => t.id === id);
  const isTransfer = tx && (tx.type === 'transfer_out' || tx.type === 'transfer_in');

  const msg = isTransfer
    ? 'Ini transaksi transfer — kedua sisi (keluar & masuk) akan ikut terhapus. Lanjutkan?'
    : 'Hapus transaksi ini secara permanen?';

  openModal('Hapus Transaksi', msg, async () => {
    try {
      if (isTransfer && tx.transferId) {
        const outId = tx.transferId + '_out';
        const inId  = tx.transferId + '_in';
        await Promise.all([
          deleteDoc(doc(userCol('transactions'), outId)),
          deleteDoc(doc(userCol('transactions'), inId)),
        ]);
        transactions = transactions.filter(t => t.transferId !== tx.transferId);
      } else {
        await deleteDoc(doc(userCol('transactions'), id));
        transactions = transactions.filter(t => t.id !== id);
      }
      renderHistory();
      renderDashboard();
      toast('Transaksi dihapus','info');
    } catch (err) {
      console.error(err);
      toast('Gagal menghapus, cek koneksi', 'error');
    }
  });
}

// ══════════════════════════════════════════════════
// TOAST
// ══════════════════════════════════════════════════
const TOAST_ICONS = {
  success: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
  error:   '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
  info:    '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
  warn:    '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
};
let toastTimer;
function toast(msg, type = 'success') {
  const el = document.getElementById('toast');
  el.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${TOAST_ICONS[type]||TOAST_ICONS.info}</svg><span>${msg}</span>`;
  el.className = 'toast show ' + type;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
}

// ══════════════════════════════════════════════════
// EMPTY STATE
// ══════════════════════════════════════════════════
function emptyHTML(iconKey, text, sub) {
  return `<div class="empty-state"><div class="empty-icon">${svgIcon(iconKey, 40)}</div><div class="empty-text">${text}</div><div class="empty-sub">${sub}</div></div>`;
}
// ══════════════════════════════════════════════════
// SEED DEMO
// ══════════════════════════════════════════════════
// ══════════════════════════════════════════════════
// EXPORT / IMPORT
// ══════════════════════════════════════════════════
function exportJSON() {
  const payload = {
    _app: 'NaDomped',
    _version: 4,
    _exported: new Date().toISOString(),
    _txCount: transactions.length,
    transactions, wallets, catsOut, catsIn,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = `NaDomped-backup-${today()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  toast('Backup JSON berhasil diunduh', 'success');
}

function exportCSV() {
  const allCats = [...catsOut, ...catsIn];
  const header = ['Tanggal','Jenis','Jumlah','Keterangan','Dompet','Kategori'];
  const rows = transactions.map(tx => {
    const w   = wallets.find(w => w.id === tx.wallet)?.name || tx.wallet;
    const cat = allCats.find(c => c.id === tx.cat)?.name || tx.cat;
    return [tx.date, tx.type==='out'?'Pengeluaran':'Pemasukan', tx.amount, `"${(tx.desc||'').replace(/"/g,'""')}"`, w, cat].join(',');
  });
  const csv  = [header.join(','), ...rows].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = `NaDomped-transaksi-${today()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast('Export CSV berhasil', 'success');
}

function triggerImport() {
  document.getElementById('importInput').click();
}

function importJSON(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const data = JSON.parse(ev.target.result);
      if (!data._app || data._app !== 'NaDomped') {
        toast('Bukan file backup NaDomped yang valid','error'); return;
      }
      openModal(
        'Restore Backup',
        `File: <strong>${file.name}</strong><br>Berisi <strong>${data._txCount || data.transactions?.length || 0} transaksi</strong>, diekspor ${data._exported ? new Date(data._exported).toLocaleDateString('id-ID') : 'unknown'}.<br><br>Data saat ini akan <strong>ditimpa</strong> sepenuhnya. Lanjutkan?`,
        () => {
          if (data.transactions) transactions = data.transactions;
          if (data.wallets)      wallets      = data.wallets;
          if (data.catsOut)      catsOut      = data.catsOut;
          if (data.catsIn)       catsIn       = data.catsIn;
          save();
          renderDashboard();
          renderSettings();
          toast(`Berhasil restore ${transactions.length} transaksi`, 'success');
        }
      );
      document.getElementById('modalConfirmBtn').textContent = 'Ya, Restore';
    } catch {
      toast('File rusak atau format tidak dikenal','error');
    }
  };
  reader.readAsText(file);
  e.target.value = '';
}

function dzDragOver(e) {
  e.preventDefault();
  document.getElementById('dropzone').classList.add('drag-over');
}
function dzDragLeave() {
  document.getElementById('dropzone').classList.remove('drag-over');
}
function dzDrop(e) {
  e.preventDefault();
  document.getElementById('dropzone').classList.remove('drag-over');
  const file = e.dataTransfer.files?.[0];
  if (!file || !file.name.endsWith('.json')) { toast('Hanya file .json yang didukung','warn'); return; }
  importJSON({ target: { files: [file], value: '' } });
}

// ══════════════════════════════════════════════════
// BOOT
// ══════════════════════════════════════════════════
applyTheme();

const initialEyeIcon = document.getElementById('hideBalanceIcon');
if (initialEyeIcon) initialEyeIcon.innerHTML = isBalanceHidden ? EYE_CLOSED : EYE_OPEN;

document.getElementById('modalOverlay').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeModal();
});

document.getElementById('advancedSettingsOverlay').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeAdvancedSettings();
});

// ── AUTH GUARD + LOAD DATA DARI FIRESTORE ──────────
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.replace('login.html');
    return;
  }

  uid = user.uid;

  try {
    await fetchAll();
    buildCatPicker();
    buildWalletChip();
    buildWalletPickerPop();
    renderDashboard();
    renderAccountIdentity();
  } catch (err) {
    console.error('Gagal memuat data:', err);
    toast('Gagal memuat data, cek koneksi', 'error');
  }
});

// ══════════════════════════════════════════════════
// EXPOSE KE WINDOW — wajib karena main.js module,
// sementara HTML pakai onclick="..." yang butuh scope global
// ══════════════════════════════════════════════════
window.navTo = navTo;
window.toggleTheme = toggleTheme;
window.setType = setType;
window.selCat = selCat;
window.toggleWalletPicker = toggleWalletPicker;
window.selWallet = selWallet;
window.toggleMoreOptions = toggleMoreOptions;
window.saveTransaction = saveTransaction;
window.setPeriod = setPeriod;
window.setFilterWallet = setFilterWallet;
window.switchCatTab = switchCatTab;
window.addWallet = addWallet;
window.deleteWallet = deleteWallet;
window.addCategory = addCategory;
window.deleteCat = deleteCat;
window.confirmClear = confirmClear;
window.confirmLogout = confirmLogout;
window.toggleIconPicker = toggleIconPicker;
window.selectPickerIcon = selectPickerIcon;
window.closeModal = closeModal;
window.deleteTx = deleteTx;
window.exportJSON = exportJSON;
window.exportCSV = exportCSV;
window.triggerImport = triggerImport;
window.importJSON = importJSON;
window.dzDragOver = dzDragOver;
window.dzDragLeave = dzDragLeave;
window.dzDrop = dzDrop;
window.openAdvancedSettings = openAdvancedSettings;
window.closeAdvancedSettings = closeAdvancedSettings;
window.renderHistory = renderHistory;
window.editWallet = editWallet;
window.cancelWalletEdit = cancelWalletEdit;
window.editCategory = editCategory;
window.cancelCatEdit = cancelCatEdit;
window.selTransferWallet = selTransferWallet;
window.toggleBalanceVisibility = toggleBalanceVisibility;
window.toggleTransferPicker = toggleTransferPicker;
