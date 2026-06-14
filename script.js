/* ============================================================
   WEDDING SITE — Максим & Анастасия 19.09.2026
   ============================================================ */

// ── COUNTDOWN ──────────────────────────────────────────────
const WEDDING_DATE = new Date('2026-09-19T14:00:00');

function updateCountdown() {
  const now  = new Date();
  const diff = WEDDING_DATE - now;

  if (diff <= 0) {
    document.getElementById('cd-days').textContent  = '0';
    document.getElementById('cd-hours').textContent = '0';
    document.getElementById('cd-mins').textContent  = '0';
    document.getElementById('cd-secs').textContent  = '0';
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
// Замените SCRIPT_URL на ссылку вашего Google Apps Script (см. инструкцию)
const SCRIPT_URL = 'ВСТАВЬТЕ_ССЫЛКУ_GOOGLE_APPS_SCRIPT_СЮДА';

window.submitForm = async function() {
  const name    = document.getElementById('f-name').value.trim();
  const phone   = document.getElementById('f-phone').value.trim();
  const attend  = document.querySelector('input[name="attend"]:checked');
  const food    = document.getElementById('f-food').value.trim();
  const wish    = document.getElementById('f-wish').value.trim();

  if (!name) { alert('Пожалуйста, введите ваше имя'); return; }
  if (!attend) { alert('Пожалуйста, выберите, придёте ли вы'); return; }

  const btn = document.querySelector('.btn-submit');
  btn.disabled = true;
  btn.textContent = 'Отправляем...';

  const payload = {
    name,
    phone,
    attend: attend.value,
    guests: guestCount,
    food,
    wish,
    timestamp: new Date().toLocaleString('ru-RU'),
  };

  // Если SCRIPT_URL не задан — показываем успех без отправки (для тестирования)
  if (SCRIPT_URL === 'ВСТАВЬТЕ_ССЫЛКУ_GOOGLE_APPS_SCRIPT_СЮДА') {
    console.log('Данные формы (тест):', payload);
    showSuccess();
    return;
  }

  try {
    await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',                          // Google Apps Script требует no-cors
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    showSuccess();
  } catch (err) {
    console.error(err);
    alert('Ошибка отправки. Попробуйте ещё раз или напишите нам напрямую.');
    btn.disabled = false;
    btn.textContent = 'Отправить анкету';
  }
};

function showSuccess() {
  document.getElementById('rsvp-form').style.display = 'none';
  document.getElementById('success-msg').style.display = 'block';
}
