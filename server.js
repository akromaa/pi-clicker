require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));
app.use(express.json());

app.post('/send-pi', async (req, res) => {
  const { recipient, amount } = req.body;
  try {
    const response = await axios.post('https://sandbox.pi.network/transaction', {
      amount,
      to_address: recipient
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.PI_API_KEY}`
      }
    });

    res.json({
      txnId: response.data.id,
      message: 'Transaction réussie'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur API Pi Network',
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
