document.getElementById('transaction-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const recipient = document.getElementById('recipient').value;
  const amount = document.getElementById('amount').value;
  
  try {
    const res = await fetch('/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipient, amount })
    });
    const data = await res.json();
    document.getElementById('result').innerText = JSON.stringify(data);
  } catch (err) {
    document.getElementById('result').innerText = 'Error: ' + err.message;
  }