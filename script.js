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
const CAPTIONS = [
  'Мы маленькие...',
  'Армия',
  'Это мы в пустыне',
  'А тут уже на Сылве',
  'Семья',
  'Тот самый день - она сказала "да"',
];

let galIdx = 0;
let galTotal = 0;
let startX = 0;

function initGallery() {
  const track = document.getElementById('gallery-track');
  if (!track) return;
  galTotal = track.children.length;
  updateGallery();

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
  if (cap && CAPTIONS[galIdx] !== undefined) cap.textContent = CAPTIONS[galIdx];
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
  document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('cd-mins').textContent  = String(mins).padStart(2, '0');
  document.getElementById('cd-secs').textContent  = String(secs).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);


// ── GUEST COUNTER ──────────────────────────────────────────
let guestCount = 1;
window.changeCount = function(delta) {
  guestCount = Math.max(1, Math.min(10, guestCount + delta));
  document.getElementById('guest-count').textContent = guestCount;
};



// ── PILL BUTTONS ───────────────────────────────────────────

// Одиночный выбор (attend, transport)
window.selectPill = function(btn, field, value) {
  const group = btn.closest('.pill-group');
  group.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  const hidden = document.getElementById('f-' + field);
  if (hidden) hidden.value = value;
};

// Мультивыбор (alcohol)
window.togglePill = function(btn) {
  btn.classList.toggle('selected');
};

// ── FORM SUBMIT ────────────────────────────────────────────
// Замените на ссылку вашего Google Apps Script
const SCRIPT_URL = 'ВСТАВЬТЕ_ССЫЛКУ_GOOGLE_APPS_SCRIPT_СЮДА';

window.submitForm = async function() {
  const name   = document.getElementById('f-name').value.trim();
  const phone  = document.getElementById('f-phone').value.trim();
  // Читаем pill-кнопки
  const attendVal   = document.getElementById('f-attend') ? document.getElementById('f-attend').value : '';
  const transportVal= document.getElementById('f-transport') ? document.getElementById('f-transport').value : '';
  const wish        = document.getElementById('f-wish').value.trim();

  // Собираем алкоголь из pill-multi
  const selectedAlcohol = document.querySelectorAll('#alcohol-group .pill-btn-multi.selected');
  const alcohol = Array.from(selectedAlcohol).map(b => b.textContent.trim()).join(', ') || 'не указано';

  const attend = attendVal;
  const transport = transportVal || 'не указано';

  if (!name)    { alert('Пожалуйста, введите ваше имя'); return; }
  if (!attendVal) { alert('Пожалуйста, выберите, придёте ли вы'); return; }

  const btn = document.querySelector('.btn-submit');
  btn.disabled = true;
  btn.textContent = 'Отправляем...';

  const payload = {
    name,
    phone,
    attend: attend,
    guests: guestCount,
    alcohol,
    transport,
    wish,
    timestamp: new Date().toLocaleString('ru-RU'),
  };

  if (SCRIPT_URL === 'ВСТАВЬТЕ_ССЫЛКУ_GOOGLE_APPS_SCRIPT_СЮДА') {
    console.log('Тест — данные формы:', payload);
    showSuccess();
    return;
  }

  try {
    await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    showSuccess();
  } catch (err) {
    console.error(err);
    alert('Ошибка отправки. Попробуйте ещё раз.');
    btn.disabled = false;
    btn.textContent = 'Отправить анкету';
  }
};


// ── SUCCESS MODAL ──────────────────────────────────────────
function showSuccess() {
  // Скрываем форму
  const form = document.getElementById('rsvp-form');
  if (form) form.style.display = 'none';

  // Показываем красивое модальное окно
  const overlay = document.getElementById('success-overlay');
  overlay.classList.add('show');

  // Блокируем скролл фона
  document.body.style.overflow = 'hidden';
}

window.closeSuccess = function() {
  const overlay = document.getElementById('success-overlay');
  overlay.classList.remove('show');
  document.body.style.overflow = '';

  // Показываем сообщение под формой
  const rsvpSection = document.querySelector('.slide-rsvp');
  if (rsvpSection) {
    const msg = document.createElement('div');
    msg.style.cssText = 'text-align:center;padding:32px 0;';
    msg.innerHTML = `
      <div style="font-size:24px;color:#9A9488;margin-bottom:12px;">✦</div>
      <p style="font-family:Cormorant Garamond,serif;font-size:22px;font-style:italic;color:#1C1C1C;margin-bottom:8px;">Спасибо!</p>
      <p style="font-size:13px;font-weight:300;color:#7A7670;line-height:1.7;">Ваш ответ принят.<br>Ждём вас 19 сентября!</p>
    `;
    rsvpSection.appendChild(msg);
  }
};

// Закрытие по клику на фон
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('success-overlay');
  if (overlay) {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) window.closeSuccess();
    });
  }
});
