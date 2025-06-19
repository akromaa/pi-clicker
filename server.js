const express = require('express')
const cors = require('cors')
const axios = require('axios')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

// Charge ton API key depuis le .env
const PI_API_KEY = process.env.PI_API_KEY

// Vérification clé API
if (!PI_API_KEY) {
  console.error('❌ PI_API_KEY non définie dans le .env')
  process.exit(1)
}

// POST /payments/approve
app.post('/payments/approve', async (req, res) => {
  const { paymentId } = req.body
  try {
    console.log(`→ Approve paymentId: ${paymentId}`)
    await axios.post(
      `https://api.minepi.com/v2/payments/${paymentId}/approve`,
      {},
      { headers: { Authorization: `Key ${PI_API_KEY}` } }
    )
    res.status(200).json({ status: 'approved' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'approve_failed', details: err.message })
  }
})

// POST /payments/complete
app.post('/payments/complete', async (req, res) => {
  const { paymentId, txid } = req.body
  try {
    console.log(`→ Complete paymentId: ${paymentId}, txid: ${txid}`)
    await axios.post(
      `https://api.minepi.com/v2/payments/${paymentId}/complete`,
      { txid },
      { headers: { Authorization: `Key ${PI_API_KEY}` } }
    )
    res.status(200).json({ status: 'completed' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'complete_failed', details: err.message })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`✅ Backend listening on port ${PORT}`)
})
