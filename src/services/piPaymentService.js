const fetch = require('node-fetch');

const PI_API_KEY = '0r5vdbauvzwpi3ws8mcmmw58ggn34oyogqrsn6ewxrqv4gzg5welevj2kkqid6wv';
const PI_API_URL = 'https://sandbox.minepi.com/payments';

async function approvePayment(paymentId) {
    const response = await fetch(`${PI_API_URL}/${paymentId}/approve`, {
        method: 'POST',
        headers: {
            'Authorization': `Key ${PI_API_KEY}`,
            'Content-Type': 'application/json'
        }
    });
    return response.json();
}

async function completePayment(paymentId, txid) {
    const response = await fetch(`${PI_API_URL}/${paymentId}/complete`, {
        method: 'POST',
        headers: {
            'Authorization': `Key ${PI_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ txid })
    });
    return response.json();
}

module.exports = { approvePayment, completePayment };
