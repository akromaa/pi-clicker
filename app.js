document.getElementById('sendPiBtn').addEventListener('click', async () => {
  try {
    const res = await fetch('/send-pi', { method: 'POST' });
    const data = await res.json();
    alert(`Transaction ID : ${data.txnId || 'Échec'} - ${data.message || ''}`);
  } catch (err) {
    alert('Erreur lors de la transaction');
  }
});
