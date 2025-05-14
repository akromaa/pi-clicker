// Logs pour vérifier que le script est chargé
console.log("[INIT] Chargement du script main.js...");

// Variables pour le jeu
let score = 0;
const scoreEl = document.getElementById('score');
const clickBtn = document.getElementById('click-btn');
const payBtn = document.getElementById('pay-btn');

// Incrémenter le score au clic
clickBtn.addEventListener('click', () => {
  score++;
  scoreEl.textContent = score;
  console.log(`[CLICK] Score actuel : ${score}`);
});

// Authentifier l’utilisateur
const scopes = ['payments'];
console.log("[AUTH] Tentative d'authentification...");

Pi.authenticate(scopes)
  .then(auth => {
    console.log("[AUTH] Utilisateur authentifié avec succès :", auth);
  })
  .catch(err => {
    console.error("[AUTH] Erreur d’authentification :", err);
  });

// Paiement
payBtn.addEventListener('click', () => {
  console.log("[PAYMENT] Démarrage du processus de paiement...");

  Pi.createPayment({
    amount: 0.01,
    memo: "Achat bonus Pi Clicker",
    metadata: { bonus: true }
  }, {
    onReadyForServerApproval: (paymentId) => {
      console.log("[PAYMENT] Prêt pour approbation serveur. ID :", paymentId);
    },
    onReadyForServerCompletion: (paymentId, txid) => {
      console.log("[PAYMENT] Paiement terminé avec succès. Transaction ID :", txid);
      score += 100;
      scoreEl.textContent = score;
    },
    onCancel: (paymentId) => {
      console.warn("[PAYMENT] Paiement annulé. ID :", paymentId);
    },
    onError: (err, payment) => {
      console.error("[PAYMENT] Erreur lors du paiement :", err, payment);
    }
  });
});
