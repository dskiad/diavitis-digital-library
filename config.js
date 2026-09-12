window.APP_CONFIG = {
  // DEMO MODE: true = visitors can enter without email/OTP verification.
  // When the backend is ready, change this to false and set API_BASE_URL.
  DEMO_MODE: true,

  // Example: "https://access-api.nglgreece.org"
  API_BASE_URL: "",

  REQUEST_OTP_PATH: "/api/access/request-otp",
  VERIFY_OTP_PATH: "/api/access/verify-otp",
  SESSION_CHECK_PATH: "/api/access/session",

  WELCOME_SECONDS: 7,

  // PAGE 2 timing: the unique access-gate background is shown alone first,
  // then the email/OTP form fades in; after the form is submitted/closed,
  // the background is shown alone again before the Library opens.
  ACCESS_REVEAL_DELAY_MS: 4000,
  ACCESS_EXIT_DELAY_MS: 4000,

  // The gold symbol on page 3 opens this link in a new tab.
  KNOWLEDGE_LIBRARY_URL: "https://share.google/Bjj7P0O4Wed4X2wu2"
};

// Grand Master's opening message — four-language launch version.
// This runs before app-v2.js attaches the popup controls.
(() => {
  const byId = (id) => document.getElementById(id);
  const title = byId('wmTitle');
  if (title) {
    title.innerHTML = [
      '<span style="display:block">ΜΙΑ ΠΑΡΑΚΑΤΑΘΗΚΗ ΓΙΑ ΤΟ ΑΥΡΙΟ</span>',
      '<span style="display:block">A LEGACY FOR TOMORROW</span>',
      '<span style="display:block">UN LEGADO PARA EL MAÑANA</span>',
      '<span style="display:block">UM LEGADO PARA O AMANHÃ</span>'
    ].join('');
  }

  const greek = document.querySelector('.wm-body[data-lang-block="gr"]');
  if (greek) greek.innerHTML = `
    <h3>Ελληνικά</h3>
    <p>Αγαπητοί Αδελφοί,</p>
    <p>Το 2023, ως Αναπληρωτής Μέγας Διδάσκαλος, οραματίστηκα τη δημιουργία μιας ψηφιακής παρακαταθήκης της τεκτονικής μας ιστορίας.</p>
    <p>Με προσωπική μέριμνα και χωρίς επιβάρυνση των πόρων της ΕΜΣΤΕ, ψηφιοποιήθηκαν τα διαθέσιμα τεύχη των περιοδικών μας από το 1995 έως σήμερα.</p>
    <p>Σήμερα, ως Μέγας Διδάσκαλος, σας παραδίδω αυτή την Ψηφιακή Βιβλιοθήκη με την ευχή να αποτελέσει πηγή γνώσης, μελέτης και έμπνευσης.</p>
    <p>Διότι ο Τεκτονισμός δεν οικοδομείται μόνο με όσα πράττουμε σήμερα, αλλά και με όσα φροντίζουμε να παραδώσουμε αύριο.</p>
    <p class="wm-signature">Σεβτ. Αδ. Ιωάννης Μπενετάτος<br>Μέγας Διδάσκαλος</p>`;

  const english = document.querySelector('.wm-body[data-lang-block="en"]');
  if (english) english.innerHTML = `
    <h3>English</h3>
    <p>Dear Brethren,</p>
    <p>In 2023, as Deputy Grand Master, I envisioned the creation of a digital legacy of our Masonic history.</p>
    <p>Through personal care, and without placing any burden on the resources of the National Grand Lodge of Greece, the available issues of our magazines from 1995 to the present were digitised.</p>
    <p>Today, as Grand Master, I present to you this Digital Library, with the wish that it become a source of knowledge, study and inspiration.</p>
    <p>For Freemasonry is built not only by what we do today, but also by what we take care to hand down tomorrow.</p>
    <p class="wm-signature">MW Bro Ioannis Benetatos<br>Grand Master</p>`;

  const spanish = document.querySelector('.wm-body[data-lang-block="es"]');
  if (spanish) spanish.innerHTML = `
    <h3>Español</h3>
    <p>Queridos Hermanos,</p>
    <p>En 2023, como Gran Maestro Adjunto, concebí la creación de un legado digital de nuestra historia masónica.</p>
    <p>Con dedicación personal y sin ocasionar carga alguna a los recursos de la Gran Logia Nacional de Grecia, se digitalizaron los números disponibles de nuestras revistas desde 1995 hasta hoy.</p>
    <p>Hoy, como Gran Maestro, os entrego esta Biblioteca Digital con el deseo de que sea fuente de conocimiento, estudio e inspiración.</p>
    <p>Porque la Masonería no se construye solo con lo que hacemos hoy, sino también con lo que procuramos legar mañana.</p>
    <p class="wm-signature">Muy Respetable Hno. Ioannis Benetatos<br>Gran Maestro</p>`;

  const portuguese = document.querySelector('.wm-body[data-lang-block="pt"]');
  if (portuguese) portuguese.innerHTML = `
    <h3>Português · Brasil</h3>
    <p>Queridos Irmãos,</p>
    <p>Em 2023, como Grão-Mestre Adjunto, idealizei a criação de um legado digital de nossa história maçônica.</p>
    <p>Com dedicação pessoal e sem qualquer ônus para os recursos da Grande Loja Nacional da Grécia, foram digitalizadas as edições disponíveis de nossas revistas, de 1995 até hoje.</p>
    <p>Hoje, como Grão-Mestre, entrego a vocês esta Biblioteca Digital com o desejo de que seja fonte de conhecimento, estudo e inspiração.</p>
    <p>Pois a Maçonaria não se constrói apenas com o que fazemos hoje, mas também com o que nos empenhamos em legar amanhã.</p>
    <p class="wm-signature">Mui Respeitável Irmão Ioannis Benetatos<br>Grão-Mestre</p>`;

  const ptButton = document.querySelector('.wm-lang-btn[data-lang="pt"]');
  if (ptButton) ptButton.innerHTML = '<span class="wm-flag" aria-hidden="true">🇧🇷</span> Português · Brasil';

  const close = byId('wmClose');
  if (close) close.textContent = 'CONTINUE · ΣΥΝΕΧΕΙΑ · CONTINUAR';
})();