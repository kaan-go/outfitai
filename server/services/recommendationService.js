const axios = require('axios')
const FormData = require('form-data')
const { getAuthHeaders } = require('./wiroAuth')

const BASE_URL = process.env.WIRO_API_BASE || 'https://api.wiro.ai/v1'
const MODEL_ENDPOINT = '/Run/openai/gpt-5-mini'

async function getRecommendations(imageUrl) {
  const form = new FormData()

  form.append('inputImage', imageUrl)
  form.append(
    'prompt',
    'Bu görseldeki kıyafetleri analiz et. Her bir kıyafet parçası için (üst, alt, ayakkabı, aksesuar vb.) gerçek markaların benzer ürünlerini öner. Her ürün için şu bilgileri JSON formatında ver:\n' +
    '[\n' +
    '  {\n' +
    '    "name": "Ürün adı",\n' +
    '    "brand": "Marka adı",\n' +
    '    "category": "Kategori (üst/alt/ayakkabı/aksesuar)",\n' +
    '    "price": tahmini fiyat (sayı, USD),\n' +
    '    "link": "marka web sitesindeki ürün linki veya arama linki",\n' +
    '    "description": "Kısa açıklama"\n' +
    '  }\n' +
    ']\n' +
    'Sadece JSON array döndür, başka bir şey yazma. En az 4, en fazla 8 ürün öner.'
  )
  form.append('reasoning', 'medium')
  form.append('webSearch', 'true')
  form.append('verbosity', 'medium')

  const headers = {
    ...getAuthHeaders(),
    ...form.getHeaders(),
  }

  const { data } = await axios.post(`${BASE_URL}${MODEL_ENDPOINT}`, form, { headers })
  return data
}

function parseRecommendationOutput(rawText) {
  try {
    const jsonMatch = rawText.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
  } catch {
    // fallback
  }
  return []
}

module.exports = { getRecommendations, parseRecommendationOutput }
