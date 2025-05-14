// Ajouter une variable pour activer le mode sandbox
const isSandbox = true; // Mettre à 'true' pour activer le mode sandbox

// Si tu utilises Pi SDK, tu peux ajouter un flag pour l'API en mode sandbox
const Pi = isSandbox ? new PiClient({ baseUrl: "https://sandbox-api.minepi.com" }) : new PiClient();

// Variables pour le jeu
let score = 0;
const scoreEl = document.getElementById('score');
const clickBtn = document.getElementById('click-btn');
const payBtn = document.getElementById('pay-btn');

// Incrémenter le score au clic
clickBtn.addEventListener('click', () => {
  score++;
  scoreEl.textContent = score;
});

// Authentifier l’utilisateur
const scopes = ['payments'];
Pi.authenticate(scopes, (payment) => {
  console.log("Paiement incomplet détecté :", payment);
}).then(auth => {
  console.log("Utilisateur authentifié :", auth);
}).catch(err => {
  console.error("Erreur d’authentification :", err);
});

// Paiement
payBtn.addEventListener('click', () => {
  Pi.createPayment({
    amount: 0.01,
    memo: "Achat bonus Pi Clicker",
    metadata: { bonus: true }
  }, {
    onReadyForServerApproval: (paymentId) => {
      console.log("Prêt pour approbation serveur :", paymentId);
    },
    onReadyForServerCompletion: (paymentId, txid) => {
      console.log("Paiement terminé :", txid);
      score += 100; // Exemple : donner 100 points bonus
      scoreEl.textContent = score;
    },
    onCancel: (paymentId) => {
      console.log("Paiement annulé :", paymentId);
    },
    onError: (err, payment) => {
      console.error("Erreur de paiement :", err);
    }
  });
});
