console.log("[INIT] Chargement du script main.js...");

const isSandbox = true; // false en prod
let score = 0;
const scoreEl = document.getElementById('score');
const clickBtn = document.getElementById('click-btn');
const payBtn = document.getElementById('pay-btn');

// Mock Pi SDK pour dev local
if (!window.Pi) {
  console.warn("[MOCK] Pi SDK non détecté, activation du mock pour développement local.");

  window.Pi = {
    init: ({ version, sandbox }) => {
      console.log(`[MOCK] Pi.init appelé - version: ${version}, sandbox: ${sandbox}`);
    },
    authenticate: (scopes) => {
      console.log("[MOCK] Pi.authenticate appelé avec scopes:", scopes);
      return Promise.resolve({ userId: "mockUser", scopes });
    },
    createPayment: (params, callbacks) => {
      console.log("[MOCK] Pi.createPayment appelé avec params:", params);
      setTimeout(() => {
        callbacks.onReadyForServerApproval("mockPaymentId");
        setTimeout(() => {
          callbacks.onReadyForServerCompletion("mockPaymentId", "mockTxId123");
        }, 1000);
      }, 500);
      return Promise.resolve();
    }
  };
}

function setupApp() {
  // Incrémenter score au clic
  clickBtn.addEventListener('click', () => {
    score++;
    scoreEl.textContent = score;
    console.log(`[CLICK] Score actuel : ${score}`);
  });

  // Authentifier utilisateur
  const scopes = ['payments'];

  console.log("[AUTH] Tentative d'authentification...");
  Pi.authenticate(scopes)
    .then(auth => {
      console.log("[AUTH] Authentifié avec succès :", auth);
      payBtn.disabled = false; // active bouton pay après auth réussie
    })
    .catch(err => {
      console.error("[AUTH] Erreur auth :", err);
      payBtn.disabled = true;
    });

  // Paiement
  payBtn.addEventListener('click', () => {
    console.log("[PAYMENT] Début paiement...");

    Pi.createPayment({
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
      },
      onCancel: (paymentId) => {
        console.warn("[PAYMENT] Paiement annulé. ID :", paymentId);
      },
      onError: (err, payment) => {
        console.error("[PAYMENT] Erreur :", err, payment);
      }
    });
  });
}

window.addEventListener('load', () => {
  Pi.init({
    version: "2.0",
    sandbox: isSandbox
  });
  console.log(`[INIT] Pi SDK initialisé (sandbox ${isSandbox ? "activé" : "désactivé"})`);

  setupApp();
});
