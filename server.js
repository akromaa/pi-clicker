const express = require('express');
const cors = require('cors');
const { approvePayment, completePayment } = require('./src/services/piPaymentService');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/api/payments/approve', async (req, res) => {
    try {
        const { paymentId } = req.body;
        const result = await approvePayment(paymentId);
        console.log('Approve result:', result);
        res.json(result);
    } catch (err) {
        console.error('Approve error:', err);
        res.status(500).json({ error: 'Approval failed' });
    }
});

app.post('/api/payments/complete', async (req, res) => {
    try {
        const { paymentId, txid } = req.body;
        const result = await completePayment(paymentId, txid);
        console.log('Complete result:', result);
        res.json(result);
    } catch (err) {
        console.error('Complete error:', err);
        res.status(500).json({ error: 'Completion failed' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
