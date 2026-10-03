/* ============================================================
   SCRIPT.JS — Rose Garden Theme (Pink Romantic)
   ============================================================ */

// ==================== SETTING 1: TANGGAL TARGET ====================
// Ganti sesuai tanggal jadian atau tanggal spesial
// Rumus: new Date(tahun, bulan-1, tanggal, jam, menit, detik)
// Bulan: 0=Jan, 1=Feb, 2=Mar, 3=Apr, 4=Mei, 5=Jun, 6=Jul, 7=Agu, 8=Sep, 9=Okt, 10=Nov, 11=Des
const TARGET = new Date(2026, 5, 10, 0, 0, 0); // 10 Juni 2026

// Untuk test cepat (10 detik dari sekarang), uncomment baris ini:
// const TARGET = new Date(Date.now() + 10 * 1000);

// ==================== SETTING 2: PIN RAHASIA ====================
// 4 digit, ganti sesuai keinginan
const SECRET_PIN = '1006';

// ==================== COUNTDOWN ====================
const cdDays   = document.getElementById('cd-days');
const cdHours  = document.getElementById('cd-hours');
const cdMins   = document.getElementById('cd-mins');
const cdSecs   = document.getElementById('cd-secs');
const cdStatus = document.getElementById('cd-status');
const btnEnter = document.getElementById('btn-enter');
const btnLabel = document.getElementById('btn-enter-label');
const cdLocked = document.getElementById('cd-locked-hint');
const cdRemain = document.getElementById('cd-remaining');

let countdownDone = false;

function pad(n) { return String(n).padStart(2,'0'); }
function fmtShort(totalSec) {
  const m = Math.floor(totalSec / 60);
  const s = Math.floor(totalSec % 60);
  return pad(m) + ':' + pad(s);
}

function flipNum(el, val) {
  const formatted = pad(val);
  if (el.textContent !== formatted) {
    el.classList.remove('flip');
    void el.offsetWidth;
    el.classList.add('flip');
    el.textContent = formatted;
  }
}

function updateCountdown() {
  const now = Date.now();
  const diff = TARGET.getTime() - now;

  if (diff <= 0) {
    flipNum(cdDays, 0); flipNum(cdHours, 0);
    flipNum(cdMins, 0); flipNum(cdSecs, 0);
    cdStatus.textContent = '🌸 Happy National Girlfriend Day, Sayang! 🌸';
    if (!countdownDone) {
      countdownDone = true;
      btnEnter.classList.remove('locked');
      btnEnter.classList.add('unlocked');
      btnLabel.textContent = 'Buka Kejutannya 💝';
      btnEnter.querySelectorAll('span:first-child, span:last-child').forEach(s => s.textContent = '✿');
      cdLocked.classList.add('gone');
    }
    return;
  }

  const totalSec = diff / 1000;
  const days  = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const mins  = Math.floor((totalSec % 3600) / 60);
  const secs  = Math.floor(totalSec % 60);

  flipNum(cdDays, days); flipNum(cdHours, hours);
  flipNum(cdMins, mins); flipNum(cdSecs, secs);

  if (days === 0) {
    cdRemain.textContent = fmtShort(totalSec);
  } else {
    cdRemain.textContent = pad(days) + 'h ' + pad(hours) + 'j ' + pad(mins) + 'm';
  }

  if (days === 0 && hours === 0 && mins < 5) {
    cdStatus.textContent = '🌸 Kejutannya hampir siap... 💗';
  } else if (days === 0) {
    cdStatus.textContent = 'Hari ini hari spesial kamu! 💗';
  } else if (days === 1) {
    cdStatus.textContent = 'Besok National Girlfriend Day! 🌸';
  } else {
    cdStatus.textContent = 'Menghitung hari ke kejutan spesial... 💕';
  }
}

updateCountdown();
setInterval(updateCountdown, 1000);

// Petals countdown
const petalEmoji = ['🌸','🌺','🌷','🌹','🌼','💐','✨'];
const petalsContainer = document.getElementById('cd-petals');
if (petalsContainer) {
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    p.textContent = petalEmoji[Math.floor(Math.random() * petalEmoji.length)];
    p.style.cssText = `
      left: ${Math.random()*100}%;
      font-size: ${12 + Math.random()*14}px;
      animation-duration: ${5 + Math.random()*7}s;
      animation-delay: ${Math.random()*6}s;
    `;
    petalsContainer.appendChild(p);
  }
}

// ==================== ENTER SITE (masuk ke PIN) ====================
function enterSite() {
  if (btnEnter.classList.contains('locked')) return;
  const cdPage = document.getElementById('countdown-page');
  cdPage.classList.add('hidden');
  setTimeout(() => {
    cdPage.style.display = 'none';
    showPinPage();
  }, 800);
}

function showPinPage() {
  const pinPage = document.getElementById('pin-page');
  pinPage.style.display = 'flex';
  setTimeout(() => pinPage.style.opacity = '1', 50);
}

// ==================== PIN LOGIC ====================
const giftSlide = document.getElementById('gift-slide');
let giftOpened = false;
let pinInput = '';
const pinDots = document.querySelectorAll('.pin-dot');
const pinError = document.getElementById('pin-error');
const pinPage = document.getElementById('pin-page');

// Pin petals
const pinPetalsContainer = document.getElementById('pin-petals');
if (pinPetalsContainer) {
  for (let i = 0; i < 14; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    p.textContent = petalEmoji[Math.floor(Math.random() * petalEmoji.length)];
    p.style.cssText = `
      left: ${Math.random()*100}%;
      font-size: ${12 + Math.random()*14}px;
      animation-duration: ${5 + Math.random()*7}s;
      animation-delay: ${Math.random()*6}s;
    `;
    pinPetalsContainer.appendChild(p);
  }
}

document.querySelectorAll('.pin-key').forEach(key => {
  key.addEventListener('click', () => handlePinKey(key.dataset.num));
});

function handlePinKey(action) {
  pinError.classList.remove('show');
  if (action === 'clear') {
    pinInput = pinInput.slice(0, -1);
    updatePinDots();
  } else if (action === 'ok') {
    checkPin();
  } else {
    if (pinInput.length < 4) {
      pinInput += action;
      updatePinDots();
    }
  }
}

function updatePinDots() {
  pinDots.forEach((dot, i) => {
    dot.classList.remove('filled', 'error');
    if (i < pinInput.length) dot.classList.add('filled');
  });
}

function checkPin() {
  if (pinInput.length !== 4) return;
  if (pinInput === SECRET_PIN) {
    pinPage.style.transition = 'opacity 0.6s ease';
    pinPage.style.opacity = '0';
    setTimeout(() => {
      pinPage.style.display = 'none';
      showGiftSlide();
    }, 600);
  } else {
    pinDots.forEach(dot => {
      dot.classList.remove('filled');
      dot.classList.add('error');
    });
    pinError.classList.add('show');
    pinInput = '';
    setTimeout(() => pinDots.forEach(dot => dot.classList.remove('error')), 500);
  }
}

// ==================== GIFT BOX ====================
function showGiftSlide() {
  giftSlide.classList.add('visible');
  const eyebrow = document.getElementById('gift-eyebrow');
  const box     = document.getElementById('gift-box-container');
  const hint    = document.getElementById('gift-hint');
  setTimeout(() => eyebrow.classList.add('in'), 100);
  setTimeout(() => box.classList.add('in'), 300);
  setTimeout(() => {
    hint.classList.add('in');
    setTimeout(() => hint.classList.add('pulse'), 900);
  }, 600);
}

function openGiftBox() {
  if (giftOpened) return;
  giftOpened = true;

  const box      = document.getElementById('gift-box-container');
  const sparkles = document.getElementById('gift-sparkles');
  const hint     = document.getElementById('gift-hint');
  const lidGroup = document.getElementById('gift-lid-group');

  hint.style.opacity = '0';
  hint.classList.remove('pulse');

  lidGroup.style.transformOrigin = 'center top';
  lidGroup.style.transition = 'transform 0.6s cubic-bezier(0.34,1.56,0.64,1)';
  lidGroup.style.transform  = 'rotate(-35deg) translateY(-30px) translateX(-18px)';

  setTimeout(() => sparkles.classList.add('burst'), 300);

  const heartEmoji = ['💗','🌸','🌹','✨','💕','🌺'];
  for (let i = 0; i < 8; i++) {
    setTimeout(() => {
      const h = document.createElement('div');
      h.className = 'gift-heart-float';
      h.textContent = heartEmoji[Math.floor(Math.random() * heartEmoji.length)];
      const rect = box.getBoundingClientRect();
      h.style.cssText = `
        position: fixed;
        left: ${rect.left + rect.width * (0.25 + Math.random()*0.5)}px;
        top:  ${rect.top + rect.height * 0.3}px;
        font-size: ${14 + Math.random()*14}px;
