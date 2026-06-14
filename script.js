/* ============================================================
   WEDDING SITE — Максим & Анастасия 19.09.2026
   ============================================================ */

// ── ENVELOPE ───────────────────────────────────────────────
window.openEnvelope = function() {
  const btn      = document.getElementById('env-btn');
  const envelope = document.getElementById('envelope');
  const screen   = document.getElementById('envelope-screen');
  const site     = document.getElementById('main-site');

  btn.classList.add('loading');
  btn.innerHTML = '<span>Открываем...</span>';

  setTimeout(() => { envelope.classList.add('opened'); }, 200);
  setTimeout(() => { screen.classList.add('hide'); }, 1500);
  setTimeout(() => {
    screen.style.display = 'none';
    site.classList.add('visible');
    window.scrollTo(0, 0);
  }, 2100);
};


// ── GALLERY ────────────────────────────────────────────────
// Подписи к фото — замените на свои
const CAPTIONS = [
  'Наша первая встреча',
  'Лето, которое изменило всё',
  'Момент, когда он сказал «да»',
  'Вместе у моря',
  'Скоро семья ♥',
];

let galIdx = 0;
let galTotal = 0;
let startX = 0;

function initGallery() {
  const track = document.getElementById('gallery-track');
  if (!track) return;
  galTotal = track.children.length;
  updateGallery();

  // Свайп на телефоне
  const slider = document.getElementById('gallery-slider');
  slider.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) galleryMove(dx < 0 ? 1 : -1);
  });
}

window.galleryMove = function(dir) {
  galIdx = (galIdx + dir + galTotal) % galTotal;
  updateGallery();
};

window.galleryGoTo = function(i) {
  galIdx = i;
  updateGallery();
};

function updateGallery() {
  const track = document.getElementById('gallery-track');
  const dots  = document.querySelectorAll('.gallery-dot');
  const cap   = document.getElementById('gallery-caption');
  if (!track) return;
  track.style.transform = `translateX(-${galIdx * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === galIdx));
  if (cap && CAPTIONS[galIdx]) cap.textContent = CAPTIONS[galIdx];
}

document.addEventListener('DOMContentLoaded', initGallery);


// ── COUNTDOWN ──────────────────────────────────────────────
const WEDDING_DATE = new Date('2026-09-19T14:00:00');

function updateCountdown() {
  const diff = WEDDING_DATE - new Date();
  if (diff <= 0) {
    ['cd-days','cd-hours','cd-mins','cd-secs'].forEach(id => {
      document.getElementById(id).textContent = '0';
    });
    return;
  }
  const days  = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins  = Math.floor((diff % 3600000) / 60000);
  const secs  = Math.floor((diff % 60000) / 1000);
  document.getElementById('cd-days').textContent  = days;
  document.getElementById('cd-hours').textContent = String(hours).padStart(2,'0');
  document.getElementById('cd-mins').textContent  = String(mins).padStart(2,'0');
  document.getElementById('cd-secs').textContent  = String(secs).padStart(2,'0');
}
updateCountdown();
setInterval(updateCountdown, 1000);


// ── GUEST COUNTER ──────────────────────────────────────────
let guestCount = 1;
window.changeCount = function(delta) {
  guestCount = Math.max(1, Math.min(10, guestCount + delta));
  document.getElementById('guest-count').textContent = guestCount;
};


// ── FORM SUBMIT ────────────────────────────────────────────
const SCRIPT_URL = 'ВСТАВЬТЕ_ССЫЛКУ_GOOGLE_APPS_SCRIPT_СЮДА';

window.submitForm = async function() {
  const name   = document.getElementById('f-name').value.trim();
  const phone  = document.getElementById('f-phone').value.trim();
  const attend = document.querySelector('input[name="attend"]:checked');
  const food   = document.getElementById('f-food').value.trim();
  const wish   = document.getElementById('f-wish').value.trim();

  if (!name)   { alert('Пожалуйста, введите ваше имя'); return; }
  if (!attend) { alert('Пожалуйста, выберите, придёте ли вы'); return; }

  const btn = document.querySelector('.btn-submit');
  btn.disabled = true;
  btn.textContent = 'Отправляем...';

  const payload = { name, phone, attend: attend.value,
    guests: guestCount, food, wish,
    timestamp: new Date().toLocaleString('ru-RU') };

  if (SCRIPT_URL === 'ВСТАВЬТЕ_ССЫЛКУ_GOOGLE_APPS_SCRIPT_СЮДА') {
    console.log('Тест:', payload); showSuccess(); return;
  }
  try {
    await fetch(SCRIPT_URL, { method:'POST', mode:'no-cors',
      headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) });
    showSuccess();
  } catch(err) {
    alert('Ошибка. Попробуйте ещё раз.');
    btn.disabled = false;
    btn.textContent = 'Отправить анкету';
  }
};

function showSuccess() {
  document.getElementById('rsvp-form').style.display = 'none';
  document.getElementById('success-msg').style.display = 'block';
}
