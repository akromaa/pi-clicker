const Pi = window.Pi;

Pi.init({ version: "2.0" });

async function authenticate() {
    try {
        const auth = await Pi.authenticate(['payments'], {
            onIncompletePaymentFound: handleIncompletePayment
        });
        return auth;
    } catch (error) {
        console.error('Erreur authentification:', error);
        updateStatus('Erreur authentification');
    }
}

async function handlePayment() {
    try {
        updateStatus('Initialisation du paiement...');
        const payment = await Pi.createPayment({
            amount: 0.02,
            memo: "premier transfert",
            metadata: { orderId: Date.now() }
        });

        payment.onReadyForServerApproval(async function (paymentId) {
            console.log('Paiement prêt pour approbation:', paymentId);
            updateStatus('En attente approbation serveur...');

            const response = await fetch('/api/payments/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentId })
            });
            const data = await response.json();
            console.log('Réponse serveur approbation:', data);
        });

        payment.onReadyForServerCompletion(async function (paymentId, txid) {
            console.log('Paiement prêt pour completion:', paymentId, txid);
            updateStatus('Finalisation de la transaction...');

            const response = await fetch('/api/payments/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentId, txid })
            });
            const data = await response.json();
            console.log('Réponse serveur completion:', data);
            updateStatus('Transaction terminée');
        });

        payment.onCancel(function (paymentId) {
            console.log('Paiement annulé:', paymentId);
            updateStatus('Paiement annulé');
        });

        payment.onError(function (error, payment) {
            console.error('Erreur paiement:', error);
            updateStatus('Erreur: ' + error.message);
        });

    } catch (error) {
        console.error('Erreur création paiement:', error);
        updateStatus('Erreur création paiement');
    }
}

function updateStatus(message) {
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = message;
}

function handleIncompletePayment(payment) {
    console.log('Paiement incomplet trouvé:', payment);
    updateStatus('Paiement incomplet trouvé');
}

document.getElementById('paymentBtn').addEventListener('click', async () => {
    await authenticate();
    await handlePayment();
});
