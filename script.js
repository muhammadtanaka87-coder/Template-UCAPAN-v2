const TARGET = new Date(Date.now() + 1 * 10 * 1000);

// Untuk tanggal asli, uncomment baris di bawah dan sesuaikan:
// const TARGET = new Date(2026, 5, 10, 0, 0, 0); // Juni = bulan ke-6 (index 5)

// PIN rahasia - ubah sesuai kebutuhan
const SECRET_PIN = '1006';

const cdDays     = document.getElementById('cd-days');
const cdHours    = document.getElementById('cd-hours');
const cdMins     = document.getElementById('cd-mins');
const cdSecs     = document.getElementById('cd-secs');
const cdStatus   = document.getElementById('cd-status');
const btnEnter   = document.getElementById('btn-enter');
const btnLabel   = document.getElementById('btn-enter-label');
const cdLocked   = document.getElementById('cd-locked-hint');
const cdRemain   = document.getElementById('cd-remaining');

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
  const now  = Date.now();
  const diff = TARGET.getTime() - now;

  if (diff <= 0) {
    flipNum(cdDays,  0);
    flipNum(cdHours, 0);
    flipNum(cdMins,  0);
    flipNum(cdSecs,  0);
    cdStatus.textContent = '💖 Happy National Girlfriend Day, My Love! 💖';
    if (!countdownDone) {
      countdownDone = true;
      btnEnter.classList.remove('locked');
      btnEnter.classList.add('unlocked');
      btnLabel.textContent = 'Open Your Surprise 💝';
      btnEnter.querySelectorAll('span:first-child, span:last-child').forEach(s => s.textContent = '✦');
      cdLocked.classList.add('gone');
    }
    return;
  }

  const totalSec = diff / 1000;
  const days  = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const mins  = Math.floor((totalSec % 3600) / 60);
  const secs  = Math.floor(totalSec % 60);

  flipNum(cdDays,  days);
  flipNum(cdHours, hours);
  flipNum(cdMins,  mins);
  flipNum(cdSecs,  secs);

  if (days === 0) {
    cdRemain.textContent = fmtShort(totalSec);
  } else {
    cdRemain.textContent = pad(days) + 'h ' + pad(hours) + 'j ' + pad(mins) + 'm';
  }

  if (days === 0 && hours === 0 && mins < 1) {
    cdStatus.textContent = '⏳ Your surprise is almost ready... 💕';
    cdStatus.style.color = 'var(--roselit)';
  } else if (days === 0 && hours === 0 && mins < 5) {
    cdStatus.textContent = '⏳ Your surprise is almost ready... 💕';
    cdStatus.style.color = 'var(--roselit)';
  } else if (days === 0) {
    cdStatus.textContent = 'Today is your special day! 💗';
  } else if (days === 1) {
    cdStatus.textContent = 'Tomorrow is National Girlfriend Day! 🌸';
  } else {
    cdStatus.textContent = 'Counting down to your special surprise... 💕';
  }
}

updateCountdown();
setInterval(updateCountdown, 1000);

const petalEmoji = ['🌊','🧊','💎','✨','💠','❄'];
const petalsContainer = document.getElementById('cd-petals');
for (let i = 0; i < 18; i++) {
  const p = document.createElement('div');
  p.className = 'petal';
  p.textContent = petalEmoji[Math.floor(Math.random() * petalEmoji.length)];
  p.style.cssText = `
    left: ${Math.random()*100}%;
    font-size: ${10 + Math.random()*12}px;
    animation-duration: ${5 + Math.random()*7}s;
    animation-delay: ${Math.random()*6}s;
  `;
  petalsContainer.appendChild(p);
}

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
  pinPage.style.display = 'flex';
  setTimeout(() => {
    pinPage.style.opacity = '1';
  }, 50);
}

const giftSlide = document.getElementById('gift-slide');
let giftOpened  = false;

// PIN state
let pinInput = '';
const pinDots = document.querySelectorAll('.pin-dot');
const pinError = document.getElementById('pin-error');
const pinPage = document.getElementById('pin-page');

// Create PIN petals
const pinPetalEmoji = ['🌊','🧊','💎','✨','💠','❄'];
const pinPetalsContainer = document.getElementById('pin-petals');
for (let i = 0; i < 14; i++) {
  const p = document.createElement('div');
  p.className = 'petal';
  p.textContent = pinPetalEmoji[Math.floor(Math.random() * pinPetalEmoji.length)];
  p.style.cssText = `
    left: ${Math.random()*100}%;
    font-size: ${10 + Math.random()*12}px;
    animation-duration: ${5 + Math.random()*7}s;
    animation-delay: ${Math.random()*6}s;
  `;
  pinPetalsContainer.appendChild(p);
}

// PIN keypad handler
document.querySelectorAll('.pin-key').forEach(key => {
  key.addEventListener('click', () => {
    const num = key.dataset.num;
    handlePinKey(num);
  });
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
    if (i < pinInput.length) {
      dot.classList.add('filled');
    }
  });
}

function checkPin() {
  if (pinInput.length !== 4) return;

  if (pinInput === SECRET_PIN) {
    // PIN correct - go to gift slide
    pinPage.style.transition = 'opacity 0.6s ease';
    pinPage.style.opacity = '0';
    setTimeout(() => {
      pinPage.style.display = 'none';
      showGiftSlide();
    }, 600);
  } else {
    // Wrong PIN
    pinDots.forEach(dot => {
      dot.classList.remove('filled');
      dot.classList.add('error');
    });
    pinError.classList.add('show');
    pinInput = '';
    setTimeout(() => {
      pinDots.forEach(dot => dot.classList.remove('error'));
    }, 500);
  }
}

function showGiftSlide() {
  giftSlide.classList.add('visible');
  const eyebrow = document.getElementById('gift-eyebrow');
  const box     = document.getElementById('gift-box-container');
  const hint    = document.getElementById('gift-hint');

  setTimeout(() => { eyebrow.classList.add('in'); }, 100);
  setTimeout(() => { box.classList.add('in'); },     300);
  setTimeout(() => {
    hint.classList.add('in');
    setTimeout(() => { hint.classList.add('pulse'); }, 900);
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

  setTimeout(() => { sparkles.classList.add('burst'); }, 300);

  const heartEmoji = ['💙','💎','✨','🌊','💠','🧊'];
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
        z-index: 6000;
        pointer-events: none;
      `;
      document.body.appendChild(h);
      void h.offsetWidth;
      h.classList.add('go');
      setTimeout(() => h.remove(), 2000);
    }, i * 120);
  }

  setTimeout(() => {
    giftSlide.style.transition = 'opacity 0.7s ease';
    giftSlide.style.opacity = '0';
    setTimeout(() => {
      giftSlide.style.display = 'none';
      document.getElementById('slider').style.display = 'block';
      playMusic();
      // New flow: kado -> quiz jail -> love meter -> intro -> menu
      document.getElementById('sq-jail').classList.add('active');
      document.getElementById('sq-jail').style.opacity = '1';
      current = 0;
      initQuizJailSlide();
    }, 700);
  }, 1400);
}

// ═══════════════════════════════════════════════════════════════
// QUIZ JAIL — "Do You Love Me?" Interactive Quiz
// Klik NO → NO makin kecil, YES makin besar
// Setelah 8x klik NO → auto show final YES
// ═══════════════════════════════════════════════════════════════

const loveQuestions = [
  "Will you always be my girl? 💕",
  "Really? Think again... 🥺",
  "I don't believe that 😭",
  "One more chance? 💗",
  "Are you sure? 😖",
  "Don't break my heart 💔",
  "Last chance, princess 👑",
  "I knew you'd choose me ❤️"
];

let currentQuestionIndex = 0;
let yesScale = 1;
let noScale = 1;
let loveQuizAnswered = false;

function initQuizJailSlide() {
  // Reset state
  currentQuestionIndex = 0;
  yesScale = 1;
  noScale = 1;
  loveQuizAnswered = false;

  document.querySelectorAll('#sq-jail .au').forEach((el,i)=>{
    setTimeout(()=>el.classList.add('in'), i*160);
  });

  // Set up initial question
  updateLoveQuestion();

  // Reset buttons
  const yesBtn = document.getElementById('love-yes-btn');
  const noBtn = document.getElementById('love-no-btn');
  const quizContainer = document.getElementById('love-quiz-container');
  const finalScreen = document.getElementById('love-final-screen');

  if (quizContainer) quizContainer.style.display = 'flex';
  if (finalScreen) finalScreen.classList.remove('active');

  // Reset YES button - clickable from the start
  if (yesBtn) {
    yesBtn.style.transform = 'scale(1)';
    yesBtn.style.fontSize = '1rem';
    yesBtn.style.padding = '14px 40px';
    yesBtn.style.opacity = '1';
    yesBtn.style.pointerEvents = 'auto';
    yesBtn.style.cursor = 'pointer';
  }

  // Reset NO button (clickable - makes YES bigger)
  if (noBtn) {
    noBtn.style.transform = 'scale(1)';
    noBtn.style.fontSize = '1rem';
    noBtn.style.padding = '14px 40px';
    noBtn.style.opacity = '1';
    noBtn.style.pointerEvents = 'auto';
    noBtn.style.cursor = 'pointer';
  }

  // Remove old listeners by cloning the buttons
  const newYesBtn = yesBtn.cloneNode(true);
  yesBtn.parentNode.replaceChild(newYesBtn, yesBtn);

  const newNoBtn = noBtn.cloneNode(true);
  noBtn.parentNode.replaceChild(newNoBtn, noBtn);

  // Set up new event listeners
  newYesBtn.addEventListener('click', loveAnswerYes);
  newNoBtn.addEventListener('click', loveAnswerNo);
}

function updateLoveQuestion() {
  const questionEl = document.getElementById('love-question');
  if (questionEl) {
    questionEl.textContent = loveQuestions[currentQuestionIndex];
    questionEl.style.animation = 'none';
    questionEl.offsetHeight;
    questionEl.style.animation = 'pulse 2s ease-in-out infinite';
  }
}

function updateLoveButtons() {
  const yesBtn = document.getElementById('love-yes-btn');
  const noBtn = document.getElementById('love-no-btn');

  if (yesBtn) {
    // YES gets bigger - max font size 2.8rem
    const yesFontSize = Math.min(2.8, 1 * yesScale);
    const yesPadding = Math.min(30, 14 * yesScale);
    const yesPaddingH = Math.min(55, 40 * yesScale);
    yesBtn.style.fontSize = `${yesFontSize}rem`;
    yesBtn.style.padding = `${yesPadding}px ${yesPaddingH}px`;
    yesBtn.style.transform = `scale(${yesScale})`;
  }

  if (noBtn) {
    // NO gets smaller
    const noFontSize = Math.max(0.5, 1 * noScale);
    const noPadding = Math.max(4, 14 * noScale);
    const noPaddingH = Math.max(10, 40 * noScale);
    noBtn.style.fontSize = `${noFontSize}rem`;
    noBtn.style.padding = `${noPadding}px ${noPaddingH}px`;
    noBtn.style.transform = `scale(${noScale})`;

    // Fade out NO when very small
    if (noScale < 0.4) {
      noBtn.style.opacity = noScale * 2;
    }
  }
}

function loveAnswerNo() {
  if (loveQuizAnswered) return;

  currentQuestionIndex++;

  // Check if all questions exhausted
  if (currentQuestionIndex >= loveQuestions.length) {
    // User gave up - make YES clickable
    const yesBtn = document.getElementById('love-yes-btn');
    if (yesBtn) {
      yesBtn.style.pointerEvents = 'auto';
      yesBtn.style.cursor = 'pointer';
      yesBtn.style.animation = 'shake 0.5s ease';
    }
    return;
  }

  // Update question
  updateLoveQuestion();

  // NO shrinks, YES grows
  noScale *= 0.78;
  yesScale *= 1.18;

  updateLoveButtons();
}

function loveAnswerYes() {
  if (loveQuizAnswered) return;
  loveShowFinalYes();
}

function loveShowFinalYes() {
  loveQuizAnswered = true;

  const quizContainer = document.getElementById('love-quiz-container');
  const finalScreen = document.getElementById('love-final-screen');

  if (quizContainer) quizContainer.style.display = 'none';
  if (finalScreen) finalScreen.classList.add('active');

  // Spawn hearts
  spawnLoveHearts();

  // After showing, go to next slide (Love Meter)
  setTimeout(() => {
    if (!transitioning) goTo(1);
  }, 2500);
}

function spawnLoveHearts() {
  const hearts = ['💙', '💎', '✨', '🧊', '💠', '🌊', '🥰', '😍'];
  const container = document.getElementById('sq-jail');

  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      const heart = document.createElement('div');
      heart.className = 'love-heart';
      heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
      heart.style.left = Math.random() * 100 + '%';
      heart.style.animationDuration = (Math.random() * 2 + 2) + 's';
      heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
      container.appendChild(heart);

      setTimeout(() => heart.remove(), 4000);
    }, i * 40);
  }
}

function resetJailSlide() {
  loveQuizAnswered = false;
  currentQuestionIndex = 0;
  yesScale = 1;
  noScale = 1;

  const noBtn = document.getElementById('love-no-btn');
  if (noBtn) {
    noBtn.style.transform = 'scale(1)';
    noBtn.style.fontSize = '1.1rem';
    noBtn.style.padding = '16px 48px';
    noBtn.style.opacity = '1';
    noBtn.style.pointerEvents = 'none';
  }

  const yesBtn = document.getElementById('love-yes-btn');
  if (yesBtn) {
    yesBtn.style.transform = 'scale(1)';
    yesBtn.style.fontSize = '1.1rem';
    yesBtn.style.padding = '16px 48px';
  }
}


// ═══════════════════════════════════════════════════════════════
// LOVE METER — press & hold to fill the heart
// ═══════════════════════════════════════════════════════════════
let loveProgress = 0, loveHolding = false, loveDone = false, loveDraining = false;
const loveHeartEmojis = ['💗','💕','💖','✨','🌸','💓'];

function initLoveMeterSlide() {
  document.querySelectorAll('#sq-love .au').forEach((el,i)=>{
    setTimeout(()=>el.classList.add('in'), i*160);
  });
}

function resetLove() {
  loveProgress = 0; loveDone = false; loveHolding = false; loveDraining = false;
  updateLoveVisual();
  const msg = document.getElementById('love-msg');
  if (msg) msg.textContent = 'Tekan & tahan untuk menerima cintaku... 💖';
  const svg = document.getElementById('love-svg');
  if (svg) svg.style.filter = 'drop-shadow(0 0 0px rgba(181,84,122,0))';
  const btn = document.getElementById('love-btn');
  if (btn) btn.classList.remove('holding');
  const contBtn = document.getElementById('lm-continue-btn');
  if (contBtn) contBtn.style.display = 'none';
}

function startLove() {
  if (loveDone) return;
  loveHolding = true;
  loveDraining = false;
  const btn = document.getElementById('love-btn');
  if (btn) btn.classList.add('holding');
  loveLoop();
}

function stopLove() {
  loveHolding = false;
  const btn = document.getElementById('love-btn');
  if (btn) btn.classList.remove('holding');
  if (loveDone) return;
  if (loveProgress >= 95) {
    loveComplete();
  } else {
    const msg = document.getElementById('love-msg');
    if (msg && loveProgress > 15) msg.textContent = 'Aww... keep holding 💕';
    drainLoveHeart();
  }
}

function loveLoop() {
  if (!loveHolding) return;
  loveProgress = Math.min(100, loveProgress + 0.6);
  updateLoveVisual();
  updateLoveMsg();
  requestAnimationFrame(loveLoop);
}

function drainLoveHeart() {
  loveDraining = true;
  const drain = () => {
    if (loveHolding || loveProgress <= 0) {
      loveProgress = 0;
      loveDraining = false;
      updateLoveVisual();
      setTimeout(() => {
        if (!loveDone) {
          const msg = document.getElementById('love-msg');
          if (msg) msg.textContent = 'Tekan & tahan untuk menerima cintaku... 💖';
        }
      }, 300);
      return;
    }
    loveProgress = Math.max(0, loveProgress - 1.2);
    updateLoveVisual();
    requestAnimationFrame(drain);
  };
  drain();
}

function updateLoveVisual() {
  const fill = document.getElementById('heart-fill');
  if (!fill) return;
  const y = 100 - loveProgress;
  fill.setAttribute('y', y);
  fill.setAttribute('height', Math.max(0, loveProgress));
  const pct = document.getElementById('love-pct');
  if (pct) pct.textContent = Math.round(loveProgress) + '%';
  const glow = document.getElementById('love-glow');
  if (glow) glow.style.opacity = (loveProgress / 100) * 0.7;
  const svg = document.getElementById('love-svg');
  if (svg) svg.style.filter = 'drop-shadow(0 0 ' + Math.round(loveProgress / 4.5) + 'px rgba(67,138,196,' + (loveProgress / 160) + '))';
}

function updateLoveMsg() {
  if (loveDraining) return;
  let msg = 'Tekan & tahan untuk menerima cintaku... 💖';
  if (loveProgress > 15) msg = 'Aww... keep holding 💕';
  if (loveProgress > 30) msg = "You're doing great! 🌸";
  if (loveProgress > 50) msg = 'Almost there, pretty girl 💗';
  if (loveProgress > 70) msg = 'Just a little more! ✨';
  if (loveProgress > 85) msg = "You're officially the best girlfriend ever! 💖";
  const el = document.getElementById('love-msg');
  if (el) el.textContent = msg;
}

function loveComplete() {
  loveDone = true; loveHolding = false;
  loveProgress = 100;
  updateLoveVisual();
  const msg = document.getElementById('love-msg');
  if (msg) msg.textContent = 'Happy National Girlfriend Day, my favorite girl ❤️';
  const btn = document.getElementById('love-btn');
  if (btn) btn.classList.remove('holding');
  const contBtn = document.getElementById('lm-continue-btn');
  if (contBtn) contBtn.style.display = 'inline-flex';
  for (let i = 0; i < 22; i++) setTimeout(() => spawnLoveHeart(), i * 65);
  setTimeout(() => { if (!transitioning) goTo(2); }, 2600);
}

function spawnLoveHeart() {
  const h = document.createElement('div');
  h.textContent = loveHeartEmojis[Math.floor(Math.random() * loveHeartEmojis.length)];
  const sz = 12 + Math.random() * 24;
  h.style.cssText = 'position:fixed;font-size:' + sz + 'px;left:' + (20 + Math.random()*60) + 'vw;bottom:-30px;pointer-events:none;z-index:9998;';
  document.body.appendChild(h);
  h.animate(
    [{ transform: 'translateY(0) scale(0) rotate(0deg)', opacity: 1 },
     { transform: 'translateY(-' + (innerHeight + 60) + 'px) scale(1) rotate(' + (Math.random()*50-25) + 'deg)', opacity: 0 }],
    { duration: 1700 + Math.random()*1600, easing: 'ease-out' }
  ).onfinish = () => h.remove();
}

const photos = [
{u:'img/foto1.jpeg',c:'my favorite girl 💖'},
{u:'img/foto2.jpeg',c:'the prettiest smile ✨'},
{u:'img/foto3.jpeg',c:'my happy place 🌸'},
{u:'img/foto4.jpeg',c:'too beautiful 💕'},
{u:'img/foto5.jpeg',c:'my forever favorite 🤍'},
{u:'img/foto6.jpeg',c:'the cutest girlfriend 🎀'},

{u:'img/foto7.jpeg',c:'our precious memory 💗'},
{u:'img/foto8.jpeg',c:'every moment with you 🌷'},
{u:'img/foto9.jpeg',c:'made with love 💌'},
{u:'img/foto10.jpeg',c:'my sunshine ☀️'},
{u:'img/foto11.jpeg',c:'always adorable 🥹'},
{u:'img/foto12.jpeg',c:'Happy Girlfriend Day 💖'},
];
const rots = [-6,-3,-1,2,4,7,-5,-2,3,5,-7,1,-4,6,-1,3,-8,2,5,-3,4,-6,1,-2,7,-4,3,-1,5,-7];

const gal = document.getElementById('gallery');
photos.forEach((p, i) => {
  const el = document.createElement('div');
  el.className = 'pi';
  el.style.setProperty('--pr', rots[i] + 'deg');
  el.style.transitionDelay = (i * 30) + 'ms';
  el.innerHTML = `<img src="${p.u}" alt="memory" loading="lazy"><div class="pcap">${p.c}</div>`;
  gal.appendChild(el);
});

const cv = document.getElementById('sparkle-canvas');
const cx = cv.getContext('2d');
let sparks = [];

function resizeCv() { cv.width = innerWidth; cv.height = innerHeight; }
resizeCv();
window.addEventListener('resize', resizeCv);

function mkSpark() {
  return {
    x: Math.random()*cv.width, y: Math.random()*cv.height,
    size: Math.random()*2.5+.8, a: Math.random(),
    da: (Math.random()*.018+.004)*(Math.random()>.5?1:-1),
    col: Math.random()>.5?'#8CC1E9':'#438BC4'
  };
}
for (let i=0;i<55;i++) sparks.push(mkSpark());

function drawStar(cx2,cy,r,a,col) {
  cx.save(); cx.globalAlpha=a; cx.fillStyle=col;
  cx.shadowBlur=7; cx.shadowColor=col; cx.beginPath();
  for(let i=0;i<4;i++){
    const ang=i/4*Math.PI*2;
    cx.lineTo(cx2+Math.cos(ang)*r,cy+Math.sin(ang)*r);
    cx.lineTo(cx2+Math.cos(ang+Math.PI/4)*r*.28,cy+Math.sin(ang+Math.PI/4)*r*.28);
  }
  cx.closePath(); cx.fill(); cx.restore();
}

function animSparks() {
  cx.clearRect(0,0,cv.width,cv.height);
  sparks.forEach(s=>{
    s.a+=s.da;
    if(s.a<=0||s.a>=1){ s.da*=-1; if(s.a<=0) Object.assign(s,mkSpark()); }
    drawStar(s.x,s.y,s.size,Math.max(0,s.a),s.col);
  });
  requestAnimationFrame(animSparks);
}
animSparks();

document.addEventListener('mousemove',e=>{
  if(Math.random()>.88){
    sparks.push({x:e.clientX,y:e.clientY,size:Math.random()*2+.5,a:.8,da:.04,col:Math.random()>.5?'#8CC1E9':'#438BC4'});
    if(sparks.length>100) sparks.shift();
  }
});

// New flow: sq-jail(0) -> sq-love(1) -> s1 intro(2) -> s-menu(3) -> s2 video(4) -> s3 photo(5) -> s4 letter(6) -> s5 ending(7)
const slides = ['sq-jail','sq-love','s1','s-menu','s2','s3','s4','s5'];
let current = 0;
let transitioning = false;

// Menu item stagger animation on enter
let menuAnimDone = false;
function animateMenuItems() {
  if (menuAnimDone) return;
  menuAnimDone = true;
  const items = document.querySelectorAll('.menu-item');
  items.forEach((item, i) => {
    setTimeout(() => {
      item.style.opacity = '1';
      item.style.transform = 'translateY(0) scale(1)';
    }, 300 + i * 150);
  });
}

function goTo(idx) {
  if (transitioning || idx === current) return;
  transitioning = true;

  const from = document.getElementById(slides[current]);
  const to   = document.getElementById(slides[idx]);

  // Restore intro slide if navigating to it
  if (slides[idx] === 's1') {
    to.style.zIndex = '1';
    to.style.pointerEvents = '';
  }
  // Send intro slide to back if leaving it
  if (slides[current] === 's1' && slides[idx] !== 's1') {
    from.style.zIndex = '0';
    from.style.pointerEvents = 'none';
  }
  // Bring target to front if coming from intro
  if (slides[idx] !== 's1' && slides[current] === 's1') {
    to.style.zIndex = '1';
  }

  from.classList.remove('active');
  from.classList.add('exit-left');
  to.style.opacity = '1';
  to.classList.add('enter-right','active');

  setTimeout(()=>{
    from.classList.remove('exit-left');
    from.style.opacity = '';
    to.classList.remove('enter-right');
    current = idx;
    transitioning = false;
    onSlideEnter(idx);
  }, 900);
}

function onSlideEnter(idx) {
  // 0 = quiz jail slide
  if (idx === 0) initQuizJailSlide();
  // 1 = love meter slide
  if (idx === 1) initLoveMeterSlide();
  // 3 = menu slide
  if (idx === 3) {
    menuAnimDone = false;
    animateMenuItems();
  }
  // 5 = gallery slide
  if (idx === 5) initGallerySlide();
  // 4 = video slide
  if (idx === 4) initVideoSlide();
  // 7 = ending slide
  if (idx === 7) initEndingSlide();
}

const audio  = document.getElementById('bg-music');
const mctrl  = document.getElementById('music-ctrl');
const micon  = document.getElementById('mbtn-icon');
const eqBars = document.querySelectorAll('.eq-b');
let playing  = false;

function playMusic() {
  audio.play().catch(()=>{});
  playing = true;
  micon.textContent = '⏸';
  eqBars.forEach(b=>b.classList.remove('paused'));
  mctrl.classList.add('show');
  // Default collapsed (small) state
  mctrl.classList.remove('expanded');
  mctrl.classList.add('collapsed');
}

function toggleMusic() {
  if (playing) {
    audio.pause(); playing=false;
    micon.textContent='▶';
    eqBars.forEach(b=>b.classList.add('paused'));
  } else {
    audio.play().catch(()=>{});
    playing=true;
    micon.textContent='⏸';
    eqBars.forEach(b=>b.classList.remove('paused'));
  }
}

function toggleMusicSize(event) {
  event.stopPropagation();
  if (mctrl.classList.contains('collapsed')) {
    mctrl.classList.remove('collapsed');
    mctrl.classList.add('expanded');
  } else {
    mctrl.classList.remove('expanded');
    mctrl.classList.add('collapsed');
  }
}

// Click on music control to toggle play/pause
mctrl.addEventListener('click', (e) => {
  if (!e.target.closest('.music-toggle')) {
    toggleMusic();
  }
});

const letterFull = `HAPPY NATIONAL GIRLFRIEND DAY 💖

Happy National Girlfriend Day, sayangku.

Hari ini aku cuma ingin mengingatkan kalau kamu adalah salah satu alasan terbesar kenapa hari-hariku terasa lebih indah. Terima kasih sudah hadir, sudah bertahan, dan sudah menjadi bagian paling spesial dalam hidupku.

Semoga kamu selalu bahagia, sehat, dimudahkan semua urusanmu, dan semua impianmu bisa tercapai satu per satu.

Teruslah jadi perempuan hebat yang selalu aku banggakan. Apa pun yang terjadi nanti, semoga kita selalu bisa saling menemani dan tumbuh bersama.

Thank you for being my safe place, my happiness, and my favorite person.

Happy National Girlfriend Day once again.

I love you more than yesterday, but less than tomorrow. 💖`;

let letterDone  = false;
let letterTimer = null;

function initLetterSlide() {
  document.querySelectorAll('#s2 .au').forEach((el,i)=>{
    setTimeout(()=>el.classList.add('in'), i*180);
  });

  const btnNext  = document.getElementById('btn-to-gallery');
  const letterEl = document.getElementById('letter-text');
  const cardEl   = document.getElementById('letter-card');

  if (!letterEl || !cardEl) return;

  cardEl.scrollTop = 0;

  if (letterDone) {
    if (btnNext) { btnNext.style.opacity = '1'; btnNext.style.pointerEvents = ''; }
    return;
  }

  if (btnNext) { btnNext.style.opacity = '0'; btnNext.style.pointerEvents = 'none'; }

  letterEl.innerHTML = '';
  const cur = document.createElement('span');
  cur.className = 'cursor-blink';
  letterEl.appendChild(cur);

  if (letterTimer) clearTimeout(letterTimer);

  let i = 0;
  const chars = [...letterFull];

  function tick() {
    if (i < chars.length) {
      cur.insertAdjacentText('beforebegin', chars[i]);
      i++;

      cardEl.scrollTop = cardEl.scrollHeight;

      letterTimer = setTimeout(tick, 18);
    } else {
      cur.remove();
      letterDone = true;
      if (btnNext) { btnNext.style.opacity = '1'; btnNext.style.pointerEvents = ''; }
    }
  }
  letterTimer = setTimeout(tick, 600);
}

let galInitDone = false;

function initGallerySlide() {
  document.getElementById('s3').scrollTop = 0;
  if (galInitDone) return;
  galInitDone = true;
  const items = document.querySelectorAll('.pi');
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('in'); obs.unobserve(e.target); }
    });
  },{ root: document.getElementById('s3'), threshold: 0.08 });
  items.forEach(it=>obs.observe(it));
}

let videoInitDone = false;

function initVideoSlide() {
  if (videoInitDone) return;
  videoInitDone = true;
  // YouTube iframe is self-contained, no extra JS needed
}

const btnToEnding = document.getElementById('btn-to-ending');
if (btnToEnding) btnToEnding.addEventListener('click', ()=>{ if(!transitioning) goTo(7); });

const loopWords  = ['Happy National Girlfriend Day','My Favorite Girl','You Mean Everything To Me','I Love You Always'];
let lwIdx        = 0, ltPos=0, ltDir=1;
let loopStarted  = false, heartsInterval=null;

function startTypingLoop() {
  if (loopStarted) return;
  loopStarted = true;
  const el = document.getElementById('tl-text');
  function tick() {
    const word = loopWords[lwIdx];
    if (ltDir===1) {
      ltPos++;
      el.textContent = word.slice(0,ltPos);
      if(ltPos>=word.length){ ltDir=-1; setTimeout(tick,2000); return; }
    } else {
      ltPos--;
      el.textContent = word.slice(0,ltPos);
      if(ltPos<=0){ ltDir=1; lwIdx=(lwIdx+1)%loopWords.length; setTimeout(tick,500); return; }
    }
    setTimeout(tick, ltDir===1?95:55);
  }
  tick();
}

function spawnHearts() {
  if (heartsInterval) return;
  const c   = document.getElementById('fhearts');
  const emo = ['💙','💎','✨','🧊','💠','🌊'];
  heartsInterval = setInterval(()=>{
    const h = document.createElement('div');
    h.className='fh';
    h.textContent = emo[Math.floor(Math.random()*emo.length)];
    h.style.cssText=`left:${Math.random()*100}%;font-size:${9+Math.random()*13}px;animation-duration:${5+Math.random()*5}s;animation-delay:${Math.random()*1.5}s;`;
    c.appendChild(h);
    setTimeout(()=>h.remove(),12000);
  },650);
}

function initEndingSlide() {
  startTypingLoop();
  spawnHearts();
}

function replay() {
  if (letterTimer) { clearTimeout(letterTimer); letterTimer=null; }

  letterDone=false; galInitDone=false; videoInitDone=false;
  loopStarted=false; lwIdx=0; ltPos=0; ltDir=1;
  menuAnimDone = false;

  if (heartsInterval) { clearInterval(heartsInterval); heartsInterval=null; }
  document.getElementById('fhearts').innerHTML='';
  document.querySelectorAll('.pi').forEach(el=>el.classList.remove('in'));
  document.getElementById('tl-text').textContent='';

  // Reset menu items
  document.querySelectorAll('.menu-item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px) scale(0.92)';
  });

  // YouTube iframe handles its own state, no reset needed

  // Reset music control
  if (mctrl) {
    mctrl.classList.remove('show', 'expanded');
    mctrl.classList.add('collapsed');
  }

  const from = document.getElementById(slides[current]);
  from.classList.remove('active');
  from.style.opacity='';

  // Replay goes back to the intro slide (s1), not the quiz/love meter
  document.getElementById('s1').classList.add('active');
  const s1 = document.getElementById('s1');
  s1.style.zIndex = '';
  s1.style.pointerEvents = '';
  s1.style.opacity = '';
  s1.style.display = '';
  s1.style.visibility = '';
  current = 2; transitioning=false;

  giftOpened=false;

  // Reset PIN
  pinInput = '';
  updatePinDots();
  pinError.classList.remove('show');
}

// ═══════════════════════════════════════════════════════════════
// MOBILE VIEWPORT FIX — ditambahkan
// Menyesuaikan tinggi slider saat address bar HP muncul/hilang
// ═══════════════════════════════════════════════════════════════
function setVH() {
  document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
}
setVH();
window.addEventListener('resize', setVH);
window.addEventListener('orientationchange', setVH);
