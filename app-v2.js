(() => {
  'use strict';

  const config = window.APP_CONFIG || {};
  const DEMO_MODE = config.DEMO_MODE !== false;
  const API_BASE = (config.API_BASE_URL || '').replace(/\/$/, '');
  const WELCOME_SECONDS = Number(config.WELCOME_SECONDS || 7);
  const ARCHIVE_SOURCE_URL = 'https://drive.google.com/drive/folders/1znNVAI73aTP0xJJcPm0kSI-mUymVtYHC';

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
  function validEmail(value) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); }
  function apiUrl(path) {
    if (!API_BASE) throw new Error('API_BASE_URL is not configured.');
    return API_BASE + path;
  }
  async function postJson(path, payload) {
    const response = await fetch(apiUrl(path), {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      credentials: 'include', body: JSON.stringify(payload)
    });
    let data = {};
    try { data = await response.json(); } catch (_) {}
    if (!response.ok) throw new Error(data.message || 'Request failed.');
    return data;
  }

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
    if (secondsLeft <= 0) enterAccessPage();
    else countdown.textContent = `Access Hall in ${secondsLeft}`;
  }, 1000);
  $('welcomeEnter').addEventListener('click', enterAccessPage);

  if (!DEMO_MODE) demoNotice.hidden = true;
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
    } finally { requestOtpButton.disabled = false; }
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
    } finally { verifyButton.disabled = false; }
  });
  $('backToAccess').addEventListener('click', () => showPage('access'));

  const knowledgeLink = $('knowledgeLink');
  knowledgeLink.href = config.KNOWLEDGE_LIBRARY_URL || '#';

  const ISSUE_LIST = [
    {year:1995, issue:'ΑΦ1', month:'1995', coverId:'1IF5ghPhZCwVyjglJox-L2Hhw5j1XNH8I', pdfId:'1iIsKmfIMid8Xu19BJwsKUtqv4QMihBQs'},
    {year:1996, issue:'ΑΦ2', month:'1996', coverId:'1BrYBZep5O7KOKv0spLce0PbozWuqh-A4', pdfId:'17i2iTyPUnVwu5JmYPJSm4iUDjTCGVnM9'},
    {year:1997, issue:'Τ3', month:'Σεπτέμβριος / September', coverId:'1Vb-PvWEsmPjKLIiFwJ_sMTxHwnqLlPQL', pdfId:'1scvvm7jUNDg_yYLgl5tW5OOjZu7Wblds'},
    {year:1998, issue:'Τ4', month:'Ιαν.–Φεβ. / Jan.–Feb.', coverId:'1fFa7yN-OO5l2o59VS6vKD0hihckpZr0_', pdfId:'1_5mc1a2fPFO6NRYBpS3iYsobqCH99b2I'},
    {year:1998, issue:'Τ5', month:'Σεπτέμβριος / September', coverId:'1UScxU8Z-cG0ErLq9VH2TSvT-PIaaNhg_', pdfId:'1ahFbYulj9yIcWA75eJ89Ru910tqt6Z-_'},
    {year:1999, issue:'Τ6', month:'Φεβρουάριος / February', coverId:'1Ve97iO3dE6pULSc2-Cnav7G_7QEONIkq', pdfId:'1Poqd4YeftZHULbXsQJFtXzOouhZBur-X'},
    {year:1999, issue:'Τ7', month:'Μάιος / May', coverId:'15TvLlHG0LzVcnnKwGasWr_SFpqc55ZJE', pdfId:'1Q_o3_-rynwIqPoYJ8lyxcGaRfAUAoebQ'},
    {year:2001, issue:'Τ8', month:'Σεπτέμβριος / September', coverId:'1_UP6OQucNEOrReLcrNhXEo_pj66rGIxp', pdfId:'1eBSRrHkHJVJGtle3fKhi2J_dLBGS3wNV'},
    {year:2002, issue:'Τ9', month:'Μάιος / May', coverId:'14iF0VTDZCA5gaf4Jwug7hAhp5EQm4MoO', pdfId:'152Z7HXaWhv-3z52ctV1sY6OduwzLUVeo'},
    {year:2002, issue:'Τ10', month:'Νοέμβριος / November', coverId:'1vUQ-hYgimCgJ1EsWfSN9YB7Wm1cs8O-3', pdfId:'1SriHmRhOO8GA5mG9czKtER2nbjC_onhY'},
    {year:2003, issue:'Τ11', month:'Μάρτιος / March', coverId:'1s4xRhhN8lC8p4aIF870oHyGVDMOr1O4R', pdfId:'1eeNdpDJ5788GIaxPhpXz2hLj59Ao1uxi'},
    {year:2003, issue:'Τ12', month:'Σεπτέμβριος / September', coverId:'1r9XKrQu13xx_EDM4GZbZPVLVEugjN62k', pdfId:'1FKNnybgxy0gbMEJJ5AU6Evr5CzHLNFuU'},
    {year:2003, issue:'Τ13', month:'Δεκέμβριος / December', coverId:'1C6XzVLDnz_T5LvHm2JgVc8Y24-U_Clyi', pdfId:'1meKx-ePC1HUApguSwISEwuV1vQmkLYO6'},
    {year:2004, issue:'Τ14', month:'Μάιος / May', coverId:'1sFe1EiFq85OypA7v2HIIpkvAJRHVQx7t', pdfId:'1WeBG93UBdzstW0-dEEdqffTNqAavdmnz'},
    {year:2004, issue:'Τ15', month:'Οκτώβριος / October', coverId:'1hbs0IcGmjF7CI6-0xGrZwkk8F4QbCtdS', pdfId:'1kuFbcJHEIhsZ4NzoxoJ7gBWZwBvUFDcW'},
    {year:2005, issue:'Τ16', month:'Φεβρουάριος / February', coverId:'1ga7bXyVJHqFv9Khlp_WPJxUHkGghuWd7', pdfId:'1-oyVIWeL6uxjuW_FeASiFirDbfdblNNy'},
    {year:2005, issue:'Τ17', month:'Μάιος / May', coverId:'1na5MtbJ71XkFFBe6IIYodJo5a_7ZTJdf', pdfId:'17SrXwilOrqLijNJB_fkYUYiPMGXfnWgJ'},
    {year:2005, issue:'Τ18', month:'Οκτώβριος / October', coverId:'1KOLf_671cltbmuenPW5zL6TIg3f8suIJ', pdfId:'1wuUdvhG3zMjnuRlTNG4n5KBKLpoQ8FTV'},
    {year:2006, issue:'Τ19', month:'Ιανουάριος / January', coverId:'1CKS7kM1_O0bN0IOqclW4dwaysXGz5X73', pdfId:'1B1O2wAzMJkH2KNSRgR-_H-4S-U88ne2Y'},
    {year:2006, issue:'Τ20', month:'Μάιος / May', coverId:'1o-hul-oukIO3wklrb2dO61r9cqpOwZux', pdfId:'1RonezKxrf1WYkOtKmHSdBbyyAJr9GgDg'},
    {year:2006, issue:'Τ21', month:'Νοέμβριος / November', coverId:'17ZcWFnbxqUt8vPUbVtCXeN7c_9CGEuf1', pdfId:'1eAoVgG-Sv6TJd7lC58uVQEadDHeciUIJ'},
    {year:2007, issue:'Τ22', month:'Μάιος / May', coverId:'1-yqSwQS2XXpy8AGd2_0bRW22iKT7d6sb', pdfId:'1GWdsTWvNLD96WQG6Y4xfRaeHzgKjP-OO'},
    {year:2007, issue:'Τ23', month:'Οκτώβριος / October', coverId:'1eKaiHiRYrwKMD73Z1NtiSJH1ZYUevsdU', pdfId:'1CEbSz9JXhQC6c6KrdpkHLsgFyzc_tD1F'},
    {year:2008, issue:'Τ24', month:'Οκτώβριος / October', coverId:'1q8X2u0ac-f5lcPfQxX-lol4OtZfvg14r', pdfId:'1ueDrl9rGNevduqrfa2ef1uLEN5hkCwX6'},
    {year:2008, issue:'Τ25', month:'Δεκέμβριος / December', coverId:'1DHGOrmotjTMhWSE8R7rt-KmdGzj3O7vx', pdfId:'1Y711iN643nirCF4-JoWUxaZ_DRnd8SS4'},
    {year:2009, issue:'Τ26', month:'Μάιος / May', coverId:'1eAUPKzNPmnP_f2VaWpdEvDK54idrzo8j', pdfId:'1_dEG-12VE8NFdHcom_aSWvxVHbZr8Z0h'},
    {year:2009, issue:'Τ27', month:'Δεκέμβριος / December', coverId:'15alLBDtrGQIYVqB7PN8uva8N3lO1z9gZ', pdfId:'1p48Uj3up_OEmdlTiDULNtSaAMtosA83C'},
    {year:2010, issue:'Τ28', month:'Ιούνιος / June', coverId:'1mMJvo7eqpvAeJHZlP-d5JKUsQihBtTLI', pdfId:'1WGErdK04PbfRO0EU8orD1qfXa_4Wxt_m'},
    {year:2011, issue:'Τ29', month:'Μάρτιος / March', coverId:'123UyrarN88wILNC6ZK7Xoe5NAEjGh5kr', pdfId:'1v5orreGW2TrK-MEE_Fg9PjKPGiTXrGS2'},
    {year:2012, issue:'Τ30–31', month:'Σεπτέμβριος / September', coverId:'1j7AoVdpmxhfmZvE3zd1zpP2HucJ69mt5', pdfId:'1fWt7STiyrePEJty_ZsUzvVcU2k2rHjxD'},
    {year:2013, issue:'Τ32', month:'Μάιος / May', coverId:'1cqSUUqPoMlCuwIbTsxYQrL02vpx9nFzI', pdfId:'1NPxX5jgXFv7LN8Yi4XXyEMqBAKuVwqHi'},
    {year:2014, issue:'Τ33', month:'Μάιος / May', coverId:'1kjdZ-PB-t3kwVawcCzRUPXN2zJFU3peX', pdfId:'1g8IJgB_v1aWxs93k6nvFQfRIdcajrb2n'},
    {year:2015, issue:'Τ34–35', month:'Απρίλιος / April', coverId:'1oHEUho0sCui7a0V5nUFM83qkemq0hF2m', pdfId:'1QxKsBwIcEMfjCUM-xSshWY5eJi4MkjL2'},
    {year:2016, issue:'Τ36', month:'Μάιος / May', coverId:'1XwauFnjxHfEWja800dnyPXF9dsfzZJ29', pdfId:'1bYUwUai_FWmJIKZ5VA2_ssg5FZXt4xgr'},
    {year:2017, issue:'Τ37', month:'Μάιος / May', coverId:'1Lholgxr2sA-OQzCsZ18PPxkaZkvmSIAT', pdfId:'1KF5F2qNXl_g1zTmrXsZ9Wf892Z3Gsasy'},
    {year:2018, issue:'Τ38', month:'Μάιος / May', coverId:'1W8jaGTvVkqRrIVyfkHm5sLPEZv-tcUn9', pdfId:'1H1Ag449ZDRJLO4_Cboj0nElzbYLDpfI1'},
    {year:2019, issue:'Τ39', month:'Σεπτέμβριος / September', coverId:'1KLSoA5k0ZaiTazCDFadWWESL7s2gJrND', pdfId:'1-wDUI-6Ed7XoE1hyo-im3iYUNVpLRErU'},
    {year:2022, issue:'Τ40', month:'Μάρτιος / March', coverId:'1lKwwGMpY7um16mos_I01gdrwz4--vl2J', pdfId:'1G1YALxK0G306fCK1LeVAQSc9jAP6L7nM'}
  ];

  const ISSUES_BY_YEAR = ISSUE_LIST.reduce((acc, item) => {
    (acc[item.year] ||= []).push(item);
    return acc;
  }, {});
  const pdfUrl = (id) => `https://drive.google.com/file/d/${id}/view`;
  const pdfCover = (id) => `https://drive.google.com/thumbnail?id=${id}&sz=w2000`;
  const coverFallback = (id) => `https://drive.google.com/thumbnail?id=${id}&sz=w1600`;

  const SHELVES = [
    { start: 1995, x: [4.4,10.0,15.4,20.8,26.0,31.2], y:34.1, w:4.4, h:15.9 },
    { start: 2001, x: [4.3,10.0,15.3,20.7,26.0,31.0], y:52.0, w:4.5, h:15.1 },
    { start: 2007, x: [4.0,10.0,15.3,20.7,26.0,31.0], y:68.3, w:4.6, h:15.0 },
    { start: 2013, x: [65.0,69.8,74.6,79.4,84.3,89.4], y:34.9, w:4.3, h:15.4 },
    { start: 2019, x: [65.0,69.8,74.6,79.4,84.4,89.4], y:53.0, w:4.35, h:15.1 },
    { start: 2025, x: [65.0,69.8,74.6], y:69.0, w:4.4, h:14.9 }
  ];

  const libraryCanvas = $('libraryCanvas');
  const issueGrid = document.querySelector('.issue-grid');

  function animateBook(button) {
    const canvasRect = libraryCanvas.getBoundingClientRect();
    const rect = button.getBoundingClientRect();
    const ghost = document.createElement('div');
    ghost.className = 'book-ghost';
    Object.assign(ghost.style, {
      left:`${rect.left}px`, top:`${rect.top}px`, width:`${rect.width}px`, height:`${rect.height}px`,
      backgroundImage:`url('assets/library-main.jpg')`,
      backgroundSize:`${canvasRect.width}px ${canvasRect.height}px`,
      backgroundPosition:`-${rect.left-canvasRect.left}px -${rect.top-canvasRect.top}px`
    });
    document.body.appendChild(ghost);
    ghost.addEventListener('animationend', () => ghost.remove(), { once:true });
  }

  function issueCard(item) {
    const card = document.createElement('article');
    card.className = 'archive-volume';
    const coverWrap = document.createElement('div');
    coverWrap.className = 'archive-cover-wrap';
    const img = document.createElement('img');
    img.className = 'archive-cover';
    img.alt = `Ο Διαβήτης ${item.issue} ${item.year} cover`;
    img.loading = 'eager';
    img.decoding = 'async';
    img.src = pdfCover(item.pdfId);
    img.dataset.fallback = '0';
    img.addEventListener('error', () => {
      if (img.dataset.fallback === '0') {
        img.dataset.fallback = '1';
        img.src = coverFallback(item.coverId);
      } else {
        img.hidden = true;
        coverWrap.classList.add('is-fallback');
        coverWrap.dataset.year = item.year;
      }
    });
    coverWrap.appendChild(img);

    const copy = document.createElement('div');
    copy.className = 'archive-volume-copy';
    copy.innerHTML = `<div class="archive-issue-number">${item.issue}</div><h3>Ο Διαβήτης · ${item.year}</h3><p>${item.month}</p>`;

    const actions = document.createElement('div');
    actions.className = 'archive-actions';
    const openPdf = document.createElement('a');
    openPdf.href = pdfUrl(item.pdfId);
    openPdf.target = '_blank';
    openPdf.rel = 'noopener noreferrer';
    openPdf.className = 'issue-pdf';
    openPdf.textContent = 'Open PDF · Άνοιγμα PDF · Abrir PDF';
    const sourceCover = document.createElement('a');
    sourceCover.href = `https://drive.google.com/file/d/${item.coverId}/view`;
    sourceCover.target = '_blank';
    sourceCover.rel = 'noopener noreferrer';
    sourceCover.className = 'cover-source-link';
    sourceCover.textContent = 'Original cover';
    actions.append(openPdf, sourceCover);
    copy.appendChild(actions);
    card.append(coverWrap, copy);
    return card;
  }

  function openIssue(year) {
    const issues = ISSUES_BY_YEAR[year] || [];
    issueGrid.innerHTML = '';
    issueGrid.className = 'issue-grid archive-collection';

    const heading = document.createElement('header');
    heading.className = 'archive-heading';
    heading.innerHTML = `<p class="issue-kicker">Digital Archive · Ψηφιακό Αρχείο</p><h2 id="issueTitle">Ο Διαβήτης · ${year}</h2>`;
    issueGrid.appendChild(heading);

    if (!issues.length) {
      const empty = document.createElement('div');
      empty.className = 'archive-empty';
      empty.innerHTML = `<strong>${year}</strong><p>No verified issue is currently present for this year in the connected Google Drive archive.<br>Δεν υπάρχει ακόμη επαληθευμένο τεύχος για το έτος αυτό στο συνδεδεμένο αρχείο.</p>`;
      issueGrid.appendChild(empty);
    } else {
      const shelf = document.createElement('div');
      shelf.className = 'archive-volume-grid';
      issues.forEach((item) => shelf.appendChild(issueCard(item)));
      issueGrid.appendChild(shelf);
      const note = document.createElement('p');
      note.className = 'archive-quality-note';
      note.textContent = 'High-resolution cover previews are generated from the first page of the original PDF; the dedicated cover image is used as fallback.';
      issueGrid.appendChild(note);
    }

    const source = document.createElement('a');
    source.className = 'archive-source';
    source.href = ARCHIVE_SOURCE_URL;
    source.target = '_blank';
    source.rel = 'noopener noreferrer';
    source.textContent = 'Open complete Google Drive archive · Πλήρες αρχείο Google Drive';
    issueGrid.appendChild(source);
    $('issueModal').hidden = false;
  }

  SHELVES.forEach((row) => {
    row.x.forEach((x, index) => {
      const year = row.start + index;
      if (year > 2027) return;
      const button = document.createElement('button');
      button.className = 'year-hotspot' + (ISSUES_BY_YEAR[year] ? ' has-archive' : '');
      button.type = 'button';
      button.setAttribute('aria-label', `Open issues for ${year}`);
      Object.assign(button.style, {left:`${x}%`,top:`${row.y}%`,width:`${row.w}%`,height:`${row.h}%`});
      const label = document.createElement('span');
      label.className = 'year-label';
      label.textContent = year;
      const zoom = document.createElement('span');
      zoom.className = 'year-zoom';
      zoom.textContent = year;
      button.append(label, zoom);

      let peekTimer;
      const peek = () => {
        clearTimeout(peekTimer);
        button.classList.add('is-peeking');
        peekTimer = setTimeout(() => button.classList.remove('is-peeking'), 850);
      };
      button.addEventListener('pointerdown', peek);
      button.addEventListener('click', () => {
        peek();
        animateBook(button);
        setTimeout(() => openIssue(year), 210);
      });
      libraryCanvas.appendChild(button);
    });
  });

  function closeModal() { $('issueModal').hidden = true; }
  $('closeIssue').addEventListener('click', closeModal);
  $('issueModal').addEventListener('click', (e) => { if (e.target === $('issueModal')) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
})();