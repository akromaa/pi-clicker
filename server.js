const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const header = {
  'Authorization': "q9ieibixqusz4kyomiaos1gbrtqvwmkmaxlk8vv3htikcmra9je4odgmsm9m92iy"
};

app.post('/create_payment', (req, res) => {
  // Here you would create a payment using Pi API
  // For example purposes, we just log and send success
  console.log("Creating payment for", req.body.username);

  res.json({
    success: true,
    payment_id: "mock_payment_id"
  });
});

app.post('/approve_payment', (req, res) => {
  const paymentId = req.body.paymentId;

  axios.post(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {}, { headers: header })
    .then(response => {
      res.json(response.data);
    })
    .catch(error => {
      console.error("Approve payment error", error.response?.data || error.message);
      res.status(500).json({ success: false });
    });
});

app.post('/complete_payment', (req, res) => {
  const paymentId = req.body.paymentId;

  axios.post(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {}, { headers: header })
    .then(response => {
      res.json(response.data);
    })
    .catch(error => {
      console.error("Complete payment error", error.response?.data || error.message);
      res.status(500).json({ success: false });
    });
});

app.listen(3000, () => console.log('Server running on port 3000'));
