function log(msg) {
  const logDiv = document.getElementById('log');
  logDiv.innerText += msg + "\n";
  console.log(msg); // utile si tu testes aussi dans un navigateur normal

  fetch('/client-log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ log: msg })
  });
}

document.getElementById('piForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const recipient = document.getElementById('recipient').value;
  const amount = parseFloat(document.getElementById('amount').value);

  log(`Submit clicked: recipient=${recipient}, amount=${amount}`);

  if (typeof Pi === 'undefined') {
    log("⚠️ Pi object is undefined — Tu n'es pas dans Pi Browser !");
    return;
  }

  Pi.init({ version: "2.0" });
  log("Pi SDK initialized");

  Pi.createPayment({
    amount,
    memo: "Test Pi sandbox",
    metadata: { recipient }
  }, async (payment) => {
    log(`Payment created: ${JSON.stringify(payment)}`);
    try {
      const res = await fetch('/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId: payment.identifier })
      });
      const data = await res.json();
      document.getElementById('result').innerText = `✅ ${data.message}`;
      log(`Server response: ${JSON.stringify(data)}`);
    } catch (err) {
      document.getElementById('result').innerText = '❌ Erreur serveur';
      log(`Erreur fetch: ${err}`);
    }
  }, (err) => {
    document.getElementById('result').innerText = `❌ Paiement annulé ou erreur: ${err}`;
    log(`Pi.createPayment error: ${err}`);
  });
});
