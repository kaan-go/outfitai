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
    'Bu görseldeki kıyafetleri analiz et. Her bir kıyafet parçası için (üst, alt, ayakkabı, aksesuar vb.) Türkiye\'de satılan markaların benzer ürünlerini öner. ' +
    'Sadece Türkiye\'de bulunan markalar ve Türk e-ticaret siteleri olsun (Trendyol, Hepsiburada, LC Waikiki, DeFacto, Koton, Mavi, Boyner, Zara TR, H&M TR, Nike TR, Adidas TR vb.). ' +
    'Fiyatlar TL (Türk Lirası) cinsinden olsun. Linkleri Türkiye sitelerinden ver (trendyol.com, hepsiburada.com, lcwaikiki.com vb.). ' +
    'Türkçe yanıt ver. Her ürün için şu bilgileri JSON formatında ver:\n' +
    '[\n' +
    '  {\n' +
    '    "name": "Ürün adı (Türkçe)",\n' +
    '    "brand": "Marka adı",\n' +
    '    "category": "Kategori (üst/alt/ayakkabı/aksesuar)",\n' +
    '    "price": tahmini fiyat (sayı, TL cinsinden),\n' +
    '    "link": "Türk e-ticaret sitesindeki ürün arama linki",\n' +
    '    "description": "Kısa Türkçe açıklama"\n' +
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
