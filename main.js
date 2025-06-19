require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch'); // npm install node-fetch@2
const app = express();

app.use(express.json());

const PI_API_KEY = process.env.PI_API_KEY;

if (!PI_API_KEY) {
  console.error("⚠️  API key missing! Set PI_API_KEY in your .env file.");
  process.exit(1);
}

const PI_API_BASE = 'https://api.minepi.com/v2';

app.post('/payments/approve', async (req, res) => {
  const { paymentId } = req.body;
  if (!paymentId) return res.status(400).json({ error: 'Missing paymentId' });

  try {
    const response = await fetch(`${PI_API_BASE}/payments/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ paymentId })
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Error approving payment:', text);
      return res.status(response.status).json({ error: text });
    }

    const data = await response.json();
    console.log('Payment approved:', data);
    res.json(data);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/payments/complete', async (req, res) => {
  const { paymentId, txid } = req.body;
  if (!paymentId || !txid) return res.status(400).json({ error: 'Missing paymentId or txid' });

  try {
    const response = await fetch(`${PI_API_BASE}/payments/complete`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ paymentId, txid })
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Error completing payment:', text);
      return res.status(response.status).json({ error: text });
    }

    const data = await response.json();
    console.log('Payment completed:', data);
    res.json(data);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
