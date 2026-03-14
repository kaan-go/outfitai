import { useState, useEffect } from 'react'
import OutfitCard from '../../components/OutfitCard/OutfitCard'
import { supabase } from '../../lib/supabase'
import { useUserStore } from '../../store/userStore'

const API_BASE = import.meta.env.VITE_API_URL || ''

export default function History() {
  const [filter, setFilter] = useState('all')
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingRecId, setLoadingRecId] = useState(null)
  const [recommendations, setRecommendations] = useState(null)
  const [selectedGeneration, setSelectedGeneration] = useState(null)
  const [addingToCart, setAddingToCart] = useState({})
  const { user } = useUserStore()

  const fetchHistory = async () => {
    if (!user) return
    setLoading(true)

    let query = supabase
      .from('generations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (filter === 'liked') query = query.eq('liked', true)
    if (filter === 'disliked') query = query.eq('liked', false)

    const { data } = await query
    setHistory(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchHistory()
  }, [user, filter])

  const handleLike = async (id) => {
    await supabase.from('generations').update({ liked: true }).eq('id', id)
    setHistory((prev) => prev.map((item) => (item.id === id ? { ...item, liked: true } : item)))
  }

  const handleDislike = async (id) => {
    await supabase.from('generations').update({ liked: false }).eq('id', id)
    setHistory((prev) => prev.map((item) => (item.id === id ? { ...item, liked: false } : item)))
  }

  const pollForResult = async (taskToken) => {
    const maxAttempts = 60
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise((r) => setTimeout(r, 3000))

      const res = await fetch(`${API_BASE}/api/recommend/task/${taskToken}`)
      const data = await res.json()

      if (data.status === 'completed') {
        return data
      }
      if (data.status === 'failed') {
        throw new Error(data.error || 'Recommendation failed')
      }
    }
    throw new Error('Recommendation timed out')
  }

  const handleGetRecommendations = async (item) => {
    if (!item.image_url) return

    setLoadingRecId(item.id)
    setRecommendations(null)
    setSelectedGeneration(item)

    try {
      const { data: existing } = await supabase
        .from('recommendations')
        .select('*')
        .eq('generation_id', item.id)
        .order('created_at', { ascending: false })
        .limit(1)

      if (existing?.length > 0 && existing[0].products?.length > 0) {
        setRecommendations(existing[0].products)
        setLoadingRecId(null)
        return
      }

      const res = await fetch(`${API_BASE}/api/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: item.image_url }),
      })

      const taskData = await res.json()
      if (!taskData.taskToken) throw new Error('Failed to start recommendation')

      const result = await pollForResult(taskData.taskToken)

      let products = result.products || []
      if (products.length === 0 && result.rawResponse) {
        try {
          const jsonMatch = result.rawResponse.match(/\[[\s\S]*\]/)
          if (jsonMatch) products = JSON.parse(jsonMatch[0])
        } catch { /* ignore */ }
      }

      if (products.length === 0 && result.outputs?.length > 0) {
        const outputText = result.outputs.map(o => o.url || '').join(' ')
        setRecommendations([{ name: 'AI Response', description: outputText, brand: '', price: 0, link: '', category: '' }])
      } else {
        setRecommendations(products)
      }

      if (user && products.length > 0) {
        await supabase.from('recommendations').insert({
          user_id: user.id,
          generation_id: item.id,
          raw_response: result.rawResponse || JSON.stringify(result),
          products,
        })
      }
    } catch (error) {
      console.error('Recommendation error:', error)
      setRecommendations([])
    } finally {
      setLoadingRecId(null)
    }
  }

  const handleAddToCart = async (product) => {
    if (!user) return
    const key = product.name + product.brand
    setAddingToCart((prev) => ({ ...prev, [key]: true }))

    try {
      await supabase.from('cart').insert({
        user_id: user.id,
        name: product.name,
        brand: product.brand || '',
        price: product.price || 0,
        link: product.link || '',
        image_url: product.image_url || '',
        quantity: 1,
      })
    } catch (error) {
      console.error('Add to cart error:', error)
    } finally {
      setAddingToCart((prev) => ({ ...prev, [key]: 'done' }))
      setTimeout(() => {
        setAddingToCart((prev) => {
          const updated = { ...prev }
          delete updated[key]
          return updated
        })
      }, 2000)
    }
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen bg-surface pt-20 pb-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-dark">Generation History</h1>
          <div className="flex gap-2">
            {['all', 'liked', 'disliked'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                  filter === f ? 'bg-primary text-white' : 'bg-white text-gray hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-6">
          <div className={`${recommendations !== null ? 'w-2/3' : 'w-full'} transition-all`}>
            {loading ? (
              <div className="text-center py-20">
                <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-3" />
                <p className="text-gray text-sm">Loading history...</p>
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-20">
                <svg className="w-16 h-16 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p className="text-gray font-medium">No generations found</p>
                <p className="text-sm text-gray-light mt-1">
                  {filter !== 'all' ? 'Try changing the filter' : 'Generate your first outfit to see it here'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {history.map((item) => (
                  <div key={item.id} className={`${selectedGeneration?.id === item.id ? 'ring-2 ring-amber-500 rounded-2xl' : ''}`}>
                    <OutfitCard
                      imageUrl={item.image_url}
                      prompt={item.prompt}
                      liked={item.liked}
                      onLike={() => handleLike(item.id)}
                      onDislike={() => handleDislike(item.id)}
                      onRegenerate={() => {}}
                      onGetRecommendations={() => handleGetRecommendations(item)}
                      loadingRec={loadingRecId === item.id}
                    />
                    <p className="text-xs text-gray-light mt-2 text-center">{formatDate(item.created_at)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {recommendations !== null && (
            <div className="w-1/3 min-w-[320px]">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-lg sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-dark">Similar Products</h2>
                  <button
                    onClick={() => { setRecommendations(null); setSelectedGeneration(null) }}
                    className="text-gray hover:text-dark transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {selectedGeneration?.image_url && (
                  <div className="p-4 border-b border-gray-100">
                    <img
                      src={selectedGeneration.image_url}
                      alt="Selected outfit"
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  </div>
                )}

                <div className="p-4">
                  {recommendations.length === 0 ? (
                    <p className="text-gray text-sm text-center py-8">No product recommendations found. Try again.</p>
                  ) : (
                    <div className="space-y-3">
                      {recommendations.map((product, idx) => {
                        const cartKey = product.name + product.brand
                        const cartStatus = addingToCart[cartKey]

                        return (
                          <div key={idx} className="border border-gray-100 rounded-xl p-3 hover:border-amber-200 transition-colors">
                            {product.category && (
                              <span className="text-xs font-semibold text-amber-600 uppercase">{product.category}</span>
                            )}
                            <h3 className="text-sm font-semibold text-dark mt-1">{product.name}</h3>
                            {product.brand && (
                              <p className="text-xs text-gray">{product.brand}</p>
                            )}
                            {product.description && (
                              <p className="text-xs text-gray-light mt-1 line-clamp-2">{product.description}</p>
                            )}
                            <div className="flex items-center justify-between mt-2">
                              {product.price > 0 && (
                                <span className="text-sm font-bold text-dark">${product.price}</span>
                              )}
                              <div className="flex gap-2 ml-auto">
                                {product.link && (
                                  <a
                                    href={product.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs px-3 py-1.5 rounded-lg bg-gray-50 text-gray hover:bg-gray-100 transition-colors"
                                  >
                                    View
                                  </a>
                                )}
                                <button
                                  onClick={() => handleAddToCart(product)}
                                  disabled={!!cartStatus}
                                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                                    cartStatus === 'done'
                                      ? 'bg-green-100 text-green-700'
                                      : cartStatus
                                      ? 'bg-amber-100 text-amber-700 cursor-not-allowed'
                                      : 'bg-amber-500 text-white hover:bg-amber-600'
                                  }`}
                                >
                                  {cartStatus === 'done' ? 'Added!' : cartStatus ? 'Adding...' : 'Add to Cart'}
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
