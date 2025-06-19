// === LOG HTML DANS LA PAGE ===
function log(msg) {
  const logEl = document.getElementById('log');
  if (logEl) {
    const line = document.createElement('div');
    line.textContent = `[LOG] ${msg}`;
    logEl.appendChild(line);
    logEl.scrollTop = logEl.scrollHeight;
  }
  console.log(msg);
}

log("Chargement du script main.js...");

const isSandbox = true;
let score = 0;

const scoreEl = document.getElementById('score');
const clickBtn = document.getElementById('click-btn');
const payBtn = document.getElementById('pay-btn');
const connectBtn = document.getElementById('connect-btn');

// === Initialisation du SDK ===
window.addEventListener('load', () => {
  if (typeof Pi === "undefined") {
    log("Erreur : SDK Pi non chargé.");
    return;
  }

  Pi.init({ version: "2.0", sandbox: isSandbox });
  log(`Pi SDK initialisé (sandbox ${isSandbox ? "activé" : "désactivé"})`);

  setupUI();
});

// === Fonction de configuration de l'UI ===
function setupUI() {
  clickBtn.addEventListener('click', () => {
    score++;
    scoreEl.textContent = score;
    log(`Clique ! Nouveau score : ${score}`);
  });

  connectBtn.addEventListener('click', () => {
    log("Connexion en cours...");
    Pi.authenticate(['payments'])
      .then(auth => {
        log(`Authentification réussie pour ${auth.user?.username || "utilisateur inconnu"}`);
        clickBtn.disabled = false;
        payBtn.disabled = false;
        connectBtn.disabled = true;
      })
      .catch(err => {
        log("Erreur d'authentification : " + err.message);
      });
  });

  payBtn.addEventListener('click', () => {
    log("Début du paiement...");

    Pi.createPayment({
      amount: 0.01,
      memo: "Achat bonus Pi Clicker",
      metadata: { bonus: true }
    }, {
      onReadyForServerApproval: (paymentId) => {
        log("Prêt pour approbation serveur. Payment ID : " + paymentId);
      },
      onReadyForServerCompletion: (paymentId, txid) => {
        log(`Paiement approuvé ! Transaction ID : ${txid}`);
        score += 100;
        scoreEl.textContent = score;
        log(`+100 bonus. Score actuel : ${score}`);
      },
      onCancel: (paymentId) => {
        log("Paiement annulé. ID : " + paymentId);
      },
      onError: (err, payment) => {
        log("Erreur de paiement : " + err.message);
      }
    });
  });
}
