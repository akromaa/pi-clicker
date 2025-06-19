console.log("[INIT] Chargement main.js");

const isSandbox = true; // passe à false en prod

let score = 0;
const scoreEl = document.getElementById('score');
const clickBtn = document.getElementById('click-btn');
const payBtn = document.getElementById('pay-btn');
const connectBtn = document.getElementById('connect-btn');
const messageEl = document.getElementById('message');

window.addEventListener('load', () => {
  Pi.init({ version: "2.0", sandbox: isSandbox });
  console.log(`[INIT] Pi SDK initialisé (sandbox ${isSandbox ? "activé" : "désactivé"})`);
});

connectBtn.addEventListener('click', () => {
  console.log("[AUTH] Tentative d'authentification...");
  Pi.authenticate(['payments'])
    .then(auth => {
      console.log("[AUTH] Authentification réussie", auth);
      messageEl.textContent = `Bienvenue ${auth.user.username} !`;
      connectBtn.disabled = true;
      clickBtn.disabled = false;
      payBtn.disabled = false;
    })
    .catch(err => {
      console.error("[AUTH] Échec de l'authentification", err);
      messageEl.textContent = "Erreur d'authentification. Veuillez utiliser le Pi Browser.";
    });
});

clickBtn.addEventListener('click', () => {
  score++;
  scoreEl.textContent = score;
  console.log(`[CLICK] Score actuel : ${score}`);
});

payBtn.addEventListener('click', () => {
  console.log("[PAYMENT] Paiement en cours...");
  payBtn.disabled = true;

  Pi.createPayment({
    amount: 0.01,
    memo: "Achat bonus Pi Clicker",
    metadata: { bonus: true }
  }, {
    onReadyForServerApproval: (paymentId) => {
      console.log("[PAYMENT] Prêt pour approbation serveur. ID :", paymentId);
    },
    onReadyForServerCompletion: (paymentId, txid) => {
      console.log("[PAYMENT] Paiement complété. TxID :", txid);
      score += 100;
      scoreEl.textContent = score;
      messageEl.textContent = "Paiement validé et bonus ajouté !";
      payBtn.disabled = false;
    },
    onCancel: (paymentId) => {
      console.warn("[PAYMENT] Paiement annulé :", paymentId);
      messageEl.textContent = "Paiement annulé.";
      payBtn.disabled = false;
    },
    onError: (err, payment) => {
      console.error("[PAYMENT] Erreur :", err, payment);
      messageEl.textContent = "Erreur lors du paiement.";
      payBtn.disabled = false;
    }
  });
});
