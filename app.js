document.getElementById('piForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const recipient = document.getElementById('recipient').value;
  const amount = parseFloat(document.getElementById('amount').value);

  Pi.init({ version: "2.0" });

  console.log(`Début transaction : recipient=${recipient}, amount=${amount}`);

  Pi.createPayment({
    amount,
    memo: "Test Pi sandbox",
    metadata: { recipient },
  }, async (payment) => {
    console.log(`Payment object :`, payment);
    try {
      const res = await fetch('/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId: payment.identifier })
      });
      const data = await res.json();
      document.getElementById('result').innerText = `✅ ${data.message}`;
      console.log(`Réponse serveur :`, data);
    } catch (err) {
      document.getElementById('result').innerText = '❌ Erreur serveur';
      console.error('Erreur fetch :', err);
    }
  }, (err) => {
    document.getElementById('result').innerText = `❌ Paiement annulé ou erreur: ${err}`;
    console.error('Erreur Pi.createPayment :', err);
  });
});
