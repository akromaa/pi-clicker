console.log("[INIT] Chargement du script main.js...");

const scoreEl = document.getElementById('score');
const clickBtn = document.getElementById('click-btn');
const payBtn = document.getElementById('pay-btn');
const messageEl = document.getElementById('message');

let score = 0;
const isSandbox = true; // false en production

// Initialisation SDK Pi
Pi.init({
  version: "2.0",
  sandbox: isSandbox
});
console.log(`[INIT] Pi SDK initialisé (sandbox ${isSandbox ? "activé" : "désactivé"})`);

// Incrémenter score au clic (disponible pour tous, sans auth)
clickBtn.addEventListener('click', () => {
  score++;
  scoreEl.textContent = score;
  console.log(`[CLICK] Score actuel : ${score}`);
});

// Paiement uniquement quand utilisateur clique sur payBtn
payBtn.addEventListener('click', () => {
  messageEl.textContent = "";  // reset message
  payBtn.disabled = true;      // éviter spam clics

  // Authentification Pi au moment du paiement
  Pi.authenticate(['payments'])
    .then(auth => {
      console.log("[AUTH] Authentifié avec succès :", auth);

      // Création paiement
      return Pi.createPayment({
        amount: 0.01,
        memo: "Achat bonus Pi Clicker",
        metadata: { bonus: true }
      }, {
        onReadyForServerApproval: (paymentId) => {
          console.log("[PAYMENT] Prêt pour approbation serveur. ID :", paymentId);
        },
        onReadyForServerCompletion: (paymentId, txid) => {
          console.log("[PAYMENT] Paiement réussi. TxID :", txid);
          score += 100;
          scoreEl.textContent = score;
          payBtn.disabled = false;
        },
        onCancel: (paymentId) => {
          console.warn("[PAYMENT] Paiement annulé. ID :", paymentId);
          payBtn.disabled = false;
        },
        onError: (err, payment) => {
          console.error("[PAYMENT] Erreur :", err, payment);
          messageEl.textContent = "Erreur lors du paiement.";
          payBtn.disabled = false;
        }
      });

    })
    .catch(err => {
      console.error("[AUTH] Erreur auth ou hors Pi Browser :", err);
      messageEl.textContent = "Vous devez ouvrir cette app dans le Pi Browser pour effectuer un paiement.";
      payBtn.disabled = false;
    });
});
