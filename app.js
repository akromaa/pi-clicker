document.getElementById('piForm').addEventListener('submit', async (e) => {
  e.preventDefault(); // Empêche le reload

  const recipient = document.getElementById('recipient').value;
  const amount = parseFloat(document.getElementById('amount').value);

  try {
    const res = await fetch('/send-pi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipient, amount })
    });

    const data = await res.json();
    document.getElementById('result').innerText = `✅ Transaction ID : ${data.txnId || 'N/A'} - ${data.message}`;

    // Vide les champs si succès
    if (res.ok) {
      document.getElementById('piForm').reset();
    }
  } catch (err) {
    document.getElementById('result').innerText = '❌ Erreur lors de la transaction';
  }
});
