const crypto = require('crypto')

function generateSignature() {
  const apiKey = process.env.WIRO_API_KEY
  const apiSecret = process.env.WIRO_API_SECRET
  const nonce = Math.floor(Date.now() / 1000).toString()

  const signature = crypto
    .createHmac('sha256', apiKey)
    .update(apiSecret + nonce)
    .digest('hex')

  return { apiKey, nonce, signature }
}

function getAuthHeaders() {
  const { apiKey, nonce, signature } = generateSignature()
  return {
    'x-api-key': apiKey,
    'x-nonce': nonce,
    'x-signature': signature,
  }
}

module.exports = { generateSignature, getAuthHeaders }
