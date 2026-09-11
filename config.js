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
    <p><strong>Αγαπητοί Αδελφοί,</strong></p>
    <p>Το 2023, ως Αναπληρωτής Μέγας Διδάσκαλος, οραματίστηκα τη δημιουργία μιας ψηφιακής παρακαταθήκης της τεκτονικής μας ιστορίας.</p>
    <p>Με προσωπική μέριμνα, χωρίς επιβάρυνση των πόρων της ΕΜΣΤΕ, και με τη συνδρομή του <strong>Νεκτάριου Ανδριόπουλου</strong>, ψηφιοποιήθηκαν τα διαθέσιμα τεύχη των περιοδικών μας από το <strong>1995 έως σήμερα</strong>, ώστε η γνώση και η μνήμη να παραμείνουν προσιτές στους Αδελφούς και στις επόμενες γενεές.</p>
    <p>Σήμερα, ως Μέγας Διδάσκαλος, σας παραδίδω αυτή την <strong>Ψηφιακή Βιβλιοθήκη</strong> με την ευχή να αποτελέσει πηγή γνώσης, μελέτης και έμπνευσης.</p>
    <p><strong>Διότι ο Τεκτονισμός δεν οικοδομείται μόνο με όσα πράττουμε σήμερα, αλλά και με όσα φροντίζουμε να παραδώσουμε αύριο.</strong></p>
    <p class="wm-signature"><strong>Σεβτ. Αδ. Ιωάννης Μπενατάτος</strong><br><strong>Μέγας Διδάσκαλος</strong></p>`;

  const english = document.querySelector('.wm-body[data-lang-block="en"]');
  if (english) english.innerHTML = `
    <h3>English</h3>
    <p><strong>Dear Brethren,</strong></p>
    <p>In 2023, as Deputy Grand Master, I envisioned the creation of a digital legacy dedicated to preserving our Masonic history.</p>
    <p>Through my personal care, without placing any burden upon the resources of the <strong>National Grand Lodge of Greece</strong>, and with the assistance of <strong>Nektarios Andriopoulos</strong>, the available issues of our magazines from <strong>1995 to the present day</strong> were digitised, so that knowledge and memory might remain accessible to our Brethren and to future generations.</p>
    <p>Today, as Grand Master, I entrust this <strong>Digital Library</strong> to you, with the hope that it will serve as a source of knowledge, study and inspiration.</p>
    <p><strong>For Freemasonry is built not only upon what we accomplish today, but also upon what we take care to preserve and pass on tomorrow.</strong></p>
    <p class="wm-signature"><strong>MW Bro Ioannis Benetatos</strong><br><strong>Grand Master</strong></p>`;

  const spanish = document.querySelector('.wm-body[data-lang-block="es"]');
  if (spanish) spanish.innerHTML = `
    <h3>Español</h3>
    <p><strong>Queridos Hermanos:</strong></p>
    <p>En 2023, como Gran Maestro Adjunto, concebí la creación de un legado digital destinado a preservar nuestra historia masónica.</p>
    <p>Por iniciativa y cuidado personal, sin ocasionar carga alguna a los recursos de la <strong>Gran Logia Nacional de Grecia</strong>, y con la colaboración de <strong>Nektarios Andriopoulos</strong>, fueron digitalizados los ejemplares disponibles de nuestras revistas desde <strong>1995 hasta la actualidad</strong>, para que el conocimiento y la memoria permanezcan accesibles a nuestros Hermanos y a las generaciones futuras.</p>
    <p>Hoy, como Gran Maestro, pongo en vuestras manos esta <strong>Biblioteca Digital</strong>, con el deseo de que se convierta en una fuente de conocimiento, estudio e inspiración.</p>
    <p><strong>Porque la Masonería no se construye únicamente con aquello que hacemos hoy, sino también con aquello que procuramos preservar y transmitir mañana.</strong></p>
    <p class="wm-signature"><strong>Muy Respetable Hno. Ioannis Benetatos</strong><br><strong>Gran Maestro</strong></p>`;

  const portuguese = document.querySelector('.wm-body[data-lang-block="pt"]');
  if (portuguese) portuguese.innerHTML = `
    <h3>Português · Brasil</h3>
    <p><strong>Queridos Irmãos,</strong></p>
    <p>Em 2023, como Grão-Mestre Adjunto, idealizei a criação de um legado digital destinado à preservação da nossa história maçônica.</p>
    <p>Por iniciativa e cuidado pessoal, sem qualquer ônus para os recursos da <strong>Grande Loja Nacional da Grécia</strong>, e com a colaboração de <strong>Nektarios Andriopoulos</strong>, foram digitalizadas as edições disponíveis de nossas revistas, de <strong>1995 até os dias atuais</strong>, para que o conhecimento e a memória permaneçam acessíveis aos nossos Irmãos e às futuras gerações.</p>
    <p>Hoje, como Grão-Mestre, entrego-lhes esta <strong>Biblioteca Digital</strong>, com o desejo de que ela se torne uma fonte de conhecimento, estudo e inspiração.</p>
    <p><strong>Porque a Maçonaria não se constrói apenas com aquilo que realizamos hoje, mas também com aquilo que cuidamos de preservar e transmitir amanhã.</strong></p>
    <p class="wm-signature"><strong>Mui Respeitável Irmão Ioannis Benetatos</strong><br><strong>Grão-Mestre</strong></p>`;

  const ptButton = document.querySelector('.wm-lang-btn[data-lang="pt"]');
  if (ptButton) ptButton.innerHTML = '<span class="wm-flag" aria-hidden="true">🇧🇷</span> Português · Brasil';

  const close = byId('wmClose');
  if (close) close.textContent = 'CONTINUE · ΣΥΝΕΧΕΙΑ · CONTINUAR';
})();