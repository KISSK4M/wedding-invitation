/* ============================================================
   WEDDING SITE — Максим & Анастасия 19.09.2026
   ============================================================ */

// ── ENVELOPE ANIMATION ────────────────────────────────────
window.openEnvelope = function() {
  const btn      = document.getElementById('env-btn');
  const envelope = document.getElementById('envelope');
  const screen   = document.getElementById('envelope-screen');
  const site     = document.getElementById('main-site');

  // 1. Кнопка уходит
  btn.classList.add('loading');
  btn.innerHTML = '<span>Открываем...</span>';

  // 2. Конверт открывается
  setTimeout(() => {
    envelope.classList.add('opened');
  }, 200);

  // 3. Экран конверта тает
  setTimeout(() => {
    screen.classList.add('hide');
  }, 1400);

  // 4. Основной сайт появляется
  setTimeout(() => {
    screen.style.display = 'none';
    site.classList.add('visible');
    window.scrollTo(0, 0);
  }, 2000);
};


// ── COUNTDOWN ──────────────────────────────────────────────
const WEDDING_DATE = new Date('2026-09-19T14:00:00');

function updateCountdown() {
  const now  = new Date();
  const diff = WEDDING_DATE - now;

  if (diff <= 0) {
    ['cd-days','cd-hours','cd-mins','cd-secs'].forEach(id => {
      document.getElementById(id).textContent = '0';
    });
    return;
  }

  const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs  = Math.floor((diff % (1000 * 60)) / 1000);

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


// ── FORM SUBMIT ────────────────────────────────────────────
// Замените SCRIPT_URL на ссылку вашего Google Apps Script
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

  const payload = {
    name, phone,
    attend: attend.value,
    guests: guestCount,
    food, wish,
    timestamp: new Date().toLocaleString('ru-RU'),
  };

  if (SCRIPT_URL === 'ВСТАВЬТЕ_ССЫЛКУ_GOOGLE_APPS_SCRIPT_СЮДА') {
    console.log('Данные формы (тест):', payload);
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

function showSuccess() {
  document.getElementById('rsvp-form').style.display = 'none';
  document.getElementById('success-msg').style.display = 'block';
}
