// Initialisation du SDK Pi
Pi.init({ version: "2.0" });

let authData = null;

document.getElementById("loginBtn").addEventListener("click", () => {
  Pi.authenticate(['username', 'payment'], onIncompletePaymentFound)
    .then((data) => {
      console.log("Authentifié :", data);
      authData = data;
      document.getElementById("payBtn").disabled = false;
    })
    .catch((err) => {
      console.error("Erreur d'authentification :", err);
    });
});

// Exemple simple de paiement
document.getElementById("payBtn").addEventListener("click", () => {
  if (!authData) {
    alert("Connectez-vous d'abord !");
    return;
  }

  Pi.createPayment({
    amount: 0.01,
    memo: "Paiement test",
    metadata: { custom_field: "demo" }
  }, {
    onReadyForServerApproval: (paymentId) => {
      console.log("Prêt pour approbation serveur :", paymentId);
      // À remplacer par un appel réel à ton serveur
      fetch('/approve_payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId })
      }).then(res => res.json()).then(console.log);
    },
    onReadyForServerCompletion: (paymentId, txid) => {
      console.log("Prêt pour completion serveur :", paymentId, txid);
      fetch('/complete_payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, txid })
      }).then(res => res.json()).then(console.log);
    },
    onCancel: (paymentId) => {
      console.log("Paiement annulé :", paymentId);
    },
    onError: (err, paymentId) => {
      console.error("Erreur de paiement :", err, paymentId);
    }
  });
});

function onIncompletePaymentFound(payment) {
  console.warn("Paiement incomplet retrouvé :", payment);
}
