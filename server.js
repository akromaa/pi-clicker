const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(express.static('.'));
app.use(bodyParser.json());

app.post('/send', async (req, res) => {
  const { recipient, amount } = req.body;
  try {
    const piRes = await axios.post('https://sandbox.pi.network/transactions', {
      recipient,
      amount
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.PI_SANDBOX_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    res.json(piRes.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));