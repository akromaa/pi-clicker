require('dotenv').config();
const express = require('express');
const axios = require('axios');
const fs = require('fs');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;
const PI_API_KEY = process.env.PI_API_KEY;

app.use(express.static(__dirname));
app.use(express.json());

const logToFile = (msg) => {
  const logMsg = `[${new Date().toISOString()}] ${msg}\n`;
  fs.appendFileSync('server.log', logMsg);
  console.log(msg);
};

app.post('/verify-payment', async (req, res) => {
  const { paymentId } = req.body;
  logToFile(`Reçu paymentId : ${paymentId}`);

  try {
    const piRes = await axios.get(`https://api.minepi.com/v2/payments/${paymentId}`, {
      headers: { Authorization: `Key ${PI_API_KEY}` }
    });

    const payment = piRes.data;
    logToFile(`Réponse API Pi : ${JSON.stringify(payment)}`);

    if (payment.status === "completed") {
      db.run("INSERT INTO transactions (payment_id, recipient, amount, status) VALUES (?, ?, ?, ?)",
        [payment.identifier, payment.metadata.recipient, payment.amount, "success"]
      );
      logToFile(`Transaction ${payment.identifier} enregistrée comme SUCCESS`);
      return res.json({ message: 'Transaction réussie et enregistrée' });
    } else {
      db.run("INSERT INTO transactions (payment_id, recipient, amount, status) VALUES (?, ?, ?, ?)",
        [payment.identifier, payment.metadata.recipient, payment.amount, "failed"]
      );
      logToFile(`Transaction ${payment.identifier} enregistrée comme FAILED`);
      return res.status(400).json({ message: 'Transaction échouée et enregistrée' });
    }
  } catch (error) {
    logToFile(`Erreur lors de la vérification : ${error.message}`);
    if (error.response) {
      logToFile(`Détail erreur API : ${JSON.stringify(error.response.data)}`);
    }
    return res.status(500).json({ message: 'Erreur lors de la vérification', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur sur http://localhost:${PORT}`);
});
