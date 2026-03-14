const axios = require('axios')
const FormData = require('form-data')
const { getAuthHeaders } = require('./wiroAuth')

const BASE_URL = process.env.WIRO_API_BASE || 'https://api.wiro.ai/v1'
const MODEL_ENDPOINT = '/Run/google/nano-banana-2'

const SKIN_TONE_NAMES = {
  '#F5D6B8': 'very light fair',
  '#E8B98A': 'light beige',
  '#D4945A': 'medium tan',
  '#A0714F': 'olive brown',
  '#6B4226': 'dark brown',
  '#3D2215': 'very dark brown',
}

function buildAvatarPrompt({ height, weight, gender, bodyType, skinTone }) {
  const skinName = SKIN_TONE_NAMES[skinTone] || 'medium'
  const genderText = gender?.toLowerCase() || 'person'

  return `Realistic human body based on these parameters:\n\nGender: ${genderText}\nHeight: ${height} cm\nWeight: ${weight} kg\nBody type: ${bodyType || 'average'}\nSkin tone: ${skinName}\n\nThe image should show only the body from neck down, no face visible, neutral background, studio lighting, realistic body proportions, photorealistic.`
}

async function generateAvatar({ height, weight, gender, bodyType, skinTone }) {
  const prompt = buildAvatarPrompt({ height, weight, gender, bodyType, skinTone })

  const form = new FormData()
  form.append('prompt', prompt)
  form.append('resolution', '1K')
  form.append('safetySetting', 'OFF')

  const headers = {
    ...getAuthHeaders(),
    ...form.getHeaders(),
  }

  const { data } = await axios.post(`${BASE_URL}${MODEL_ENDPOINT}`, form, { headers })
  return data
}

module.exports = { generateAvatar, buildAvatarPrompt }
