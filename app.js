(() => {
  'use strict';

  const config = window.APP_CONFIG || {};
  const DEMO_MODE = config.DEMO_MODE !== false;
  const API_BASE = (config.API_BASE_URL || '').replace(/\/$/, '');
  const WELCOME_SECONDS = Number(config.WELCOME_SECONDS || 7);

  const pages = {
    welcome: document.getElementById('pageWelcome'),
    access: document.getElementById('pageAccess'),
    library: document.getElementById('pageLibrary')
  };

  const $ = (id) => document.getElementById(id);
  const message = $('accessMessage');
  const demoNotice = $('demoNotice');
  const emailInput = $('emailInput');
  const otpInput = $('otpInput');
  const requestOtpButton = $('requestOtpButton');
  const verifyButton = $('verifyButton');

  function showPage(name) {
    Object.values(pages).forEach((p) => p.classList.remove('is-active'));
    pages[name].classList.add('is-active');
  }

  function setMessage(text, type = '') {
    message.textContent = text;
    message.className = 'access-message' + (type ? ` is-${type}` : '');
  }

  function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function apiUrl(path) {
    if (!API_BASE) throw new Error('API_BASE_URL is not configured.');
    return API_BASE + path;
  }

  async function postJson(path, payload) {
    const response = await fetch(apiUrl(path), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });
    let data = {};
    try { data = await response.json(); } catch (_) {}
    if (!response.ok) throw new Error(data.message || 'Request failed.');
    return data;
  }

  // PAGE 1 — auto advance after 7 seconds or immediate button entry.
  let secondsLeft = WELCOME_SECONDS;
  let welcomeDone = false;
  const countdown = $('welcomeCountdown');

  function enterAccessPage() {
    if (welcomeDone) return;
    welcomeDone = true;
    clearInterval(welcomeTimer);
    showPage('access');
  }

  countdown.textContent = `Access Hall in ${secondsLeft}`;
  const welcomeTimer = setInterval(() => {
    secondsLeft -= 1;
    if (secondsLeft <= 0) {
      enterAccessPage();
    } else {
      countdown.textContent = `Access Hall in ${secondsLeft}`;
    }
  }, 1000);

  $('welcomeEnter').addEventListener('click', enterAccessPage);

  // PAGE 2 — DEMO now, production-ready API flow later.
  if (!DEMO_MODE) {
    demoNotice.hidden = true;
  }

  requestOtpButton.addEventListener('click', async () => {
    const email = emailInput.value.trim();
    if (!validEmail(email)) {
      setMessage('Please enter a valid email address. · Παρακαλώ εισαγάγετε έγκυρο email. · Introduzca un correo electrónico válido.', 'error');
      return;
    }

    if (DEMO_MODE) {
      setMessage('Demo mode: OTP delivery is disabled for now. You may enter the Library directly. · Δοκιμαστική λειτουργία: η αποστολή OTP δεν είναι ακόμη ενεργή. · Modo de demostración: el envío de OTP aún no está activo.', 'success');
      return;
    }

    requestOtpButton.disabled = true;
    setMessage('Checking access and requesting OTP…');
    try {
      await postJson(config.REQUEST_OTP_PATH, { email });
      setMessage('If this address is authorised, an OTP has been sent. · Εφόσον το email είναι εγκεκριμένο, έχει αποσταλεί OTP. · Si el correo está autorizado, se ha enviado un OTP.', 'success');
      otpInput.focus();
    } catch (err) {
      setMessage(err.message || 'Unable to request OTP.', 'error');
    } finally {
      requestOtpButton.disabled = false;
    }
  });

  $('accessForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    if (DEMO_MODE) {
      setMessage('Open demonstration access granted. · Επιτρέπεται δοκιμαστική πρόσβαση. · Acceso de demostración concedido.', 'success');
      setTimeout(() => showPage('library'), 220);
      return;
    }

    const email = emailInput.value.trim();
    const code = otpInput.value.trim();
    if (!validEmail(email)) {
      setMessage('Please enter a valid email address. · Παρακαλώ εισαγάγετε έγκυρο email. · Introduzca un correo electrónico válido.', 'error');
      return;
    }
    if (!/^\d{4,8}$/.test(code)) {
      setMessage('Please enter the OTP code sent to your email. · Πληκτρολογήστε τον κωδικό OTP. · Introduzca el código OTP.', 'error');
      return;
    }

    verifyButton.disabled = true;
    setMessage('Verifying access… · Έλεγχος πρόσβασης… · Verificando acceso…');
    try {
      const data = await postJson(config.VERIFY_OTP_PATH, { email, code });
      if (data.ok !== true) throw new Error(data.message || 'Access denied.');
      setMessage('Access granted. Opening the Library… · Η πρόσβαση εγκρίθηκε. · Acceso concedido.', 'success');
      setTimeout(() => showPage('library'), 300);
    } catch (err) {
      setMessage(err.message || 'The email or OTP was not accepted.', 'error');
    } finally {
      verifyButton.disabled = false;
    }
  });

  $('backToAccess').addEventListener('click', () => showPage('access'));

  // PAGE 3 — external knowledge-library hotspot.
  const knowledgeLink = $('knowledgeLink');
  knowledgeLink.href = config.KNOWLEDGE_LIBRARY_URL || '#';

  const ISSUES = {
    1995: {
      title: 'Ο Διαβήτης — 1995',
      meta: 'Issue No. 1 · December 1995',
      summary: 'The first available issue in the digital archive.',
      pdf: 'https://drive.google.com/file/d/1VGRzMXwwTwMkF-0GanKuWKg08_PfM_ZM/view',
      cover: 'https://drive.google.com/thumbnail?id=1VGRzMXwwTwMkF-0GanKuWKg08_PfM_ZM&sz=w1600'
    },
    1996: {
      title: 'Ο Διαβήτης — 1996',
      meta: 'Issue No. 2 · December 1996',
      summary: 'Annual issue of the National Grand Lodge of Greece.',
      pdf: 'https://drive.google.com/file/d/1qxb6u9ukYLq8fX6sBWZHYV0cgKXYRNgq/view',
      cover: 'https://drive.google.com/thumbnail?id=1qxb6u9ukYLq8fX6sBWZHYV0cgKXYRNgq&sz=w1600'
    },
    1997: {
      title: 'Ο Διαβήτης — 1997',
      meta: 'Issue 3 · September 1997',
      summary: 'Annual issue of the National Grand Lodge of Greece.',
      pdf: 'https://drive.google.com/file/d/1S0FMPVZCAaYWWCpylYbt7v7J-Iz9XB5I/view',
      cover: 'https://drive.google.com/thumbnail?id=1S0FMPVZCAaYWWCpylYbt7v7J-Iz9XB5I&sz=w1600'
    }
  };

  const SHELVES = [
    { start: 1995, x: [4.4, 10.0, 15.4, 20.8, 26.0, 31.2], y: 34.1, w: 4.4, h: 15.9 },
    { start: 2001, x: [4.3, 10.0, 15.3, 20.7, 26.0, 31.0], y: 52.0, w: 4.5, h: 15.1 },
    { start: 2007, x: [4.0, 10.0, 15.3, 20.7, 26.0, 31.0], y: 68.3, w: 4.6, h: 15.0 },
    { start: 2013, x: [65.0, 69.8, 74.6, 79.4, 84.3, 89.4], y: 34.9, w: 4.3, h: 15.4 },
    { start: 2019, x: [65.0, 69.8, 74.6, 79.4, 84.4, 89.4], y: 53.0, w: 4.35, h: 15.1 },
    { start: 2025, x: [65.0, 69.8, 74.6], y: 69.0, w: 4.4, h: 14.9 }
  ];

  const libraryCanvas = $('libraryCanvas');

  function animateBook(button) {
    const canvasRect = libraryCanvas.getBoundingClientRect();
    const rect = button.getBoundingClientRect();
    const ghost = document.createElement('div');
    ghost.className = 'book-ghost';
    Object.assign(ghost.style, {
      left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px`,
      backgroundImage: `url('assets/library-main.jpg')`,
      backgroundSize: `${canvasRect.width}px ${canvasRect.height}px`,
      backgroundPosition: `-${rect.left - canvasRect.left}px -${rect.top - canvasRect.top}px`
    });
    document.body.appendChild(ghost);
    ghost.addEventListener('animationend', () => ghost.remove(), { once: true });
  }

  function openIssue(year) {
    const data = ISSUES[year] || {
      title: `Ο Διαβήτης — ${year}`,
      meta: `Annual archive · ${year}`,
      summary: 'This annual position is reserved in the library. The verified original cover and PDF will be linked when the source issue is added to the archive.',
      pdf: '',
      cover: ''
    };

    $('issueTitle').textContent = data.title;
    $('issueMeta').textContent = data.meta;
    $('issueSummary').textContent = data.summary;
    $('issueFallbackYear').textContent = year;

    const cover = $('issueCover');
    const fallback = $('issueCoverFallback');
    cover.hidden = !data.cover;
    fallback.hidden = !!data.cover;
    if (data.cover) {
      cover.src = data.cover;
      cover.onload = () => { cover.hidden = false; fallback.hidden = true; };
      cover.onerror = () => { cover.hidden = true; fallback.hidden = false; };
    } else {
      cover.removeAttribute('src');
    }

    const pdf = $('issuePdf');
    if (data.pdf) {
      pdf.href = data.pdf;
      pdf.classList.remove('is-disabled');
      pdf.setAttribute('aria-disabled', 'false');
    } else {
      pdf.href = '#';
      pdf.classList.add('is-disabled');
      pdf.setAttribute('aria-disabled', 'true');
    }

    $('issueModal').hidden = false;
  }

  SHELVES.forEach((row) => {
    row.x.forEach((x, index) => {
      const year = row.start + index;
      if (year > 2027) return;
      const button = document.createElement('button');
      button.className = 'year-hotspot';
      button.type = 'button';
      button.setAttribute('aria-label', `Open issue for ${year}`);
      Object.assign(button.style, {
        left: `${x}%`, top: `${row.y}%`, width: `${row.w}%`, height: `${row.h}%`
      });
      button.addEventListener('click', () => {
        animateBook(button);
        setTimeout(() => openIssue(year), 175);
      });
      libraryCanvas.appendChild(button);
    });
  });

  function closeModal() {
    $('issueModal').hidden = true;
  }
  $('closeIssue').addEventListener('click', closeModal);
  $('issueModal').addEventListener('click', (e) => { if (e.target === $('issueModal')) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
})();
