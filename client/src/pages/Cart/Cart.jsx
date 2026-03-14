import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useUserStore } from '../../store/userStore'

export default function Cart() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useUserStore()

  const fetchCart = async () => {
    if (!user) return
    setLoading(true)
    const { data } = await supabase
      .from('cart')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setItems(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchCart()
  }, [user])

  const updateQuantity = async (id, delta) => {
    const item = items.find((i) => i.id === id)
    if (!item) return

    const newQty = item.quantity + delta
    if (newQty <= 0) {
      await supabase.from('cart').delete().eq('id', id)
      setItems((prev) => prev.filter((i) => i.id !== id))
    } else {
      await supabase.from('cart').update({ quantity: newQty }).eq('id', id)
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: newQty } : i)))
    }
  }

  const removeItem = async (id) => {
    await supabase.from('cart').delete().eq('id', id)
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  const total = items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-surface pt-20 pb-10 px-4">
        <div className="max-w-3xl mx-auto text-center py-20">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray text-sm">Loading cart...</p>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-surface pt-20 pb-10 px-4">
        <div className="max-w-2xl mx-auto text-center py-20">
          <svg className="w-20 h-20 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h2 className="text-xl font-bold text-dark mb-2">Your cart is empty</h2>
          <p className="text-gray mb-6">Like an outfit and get product recommendations to add items.</p>
          <Link
            to="/history"
            className="inline-block px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors"
          >
            Browse History
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface pt-20 pb-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-dark mb-8">Shopping Cart</h1>

        <div className="space-y-4 mb-8">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-4">
              <div className="w-20 h-20 bg-gray-100 rounded-lg shrink-0 flex items-center justify-center">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <svg className="w-8 h-8 text-gray-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                {item.brand && <p className="text-xs text-primary font-semibold uppercase">{item.brand}</p>}
                <h3 className="text-sm font-medium text-dark truncate">{item.name}</h3>
                {item.price > 0 && <p className="text-lg font-bold text-dark mt-1">${Number(item.price).toFixed(2)}</p>}
                {item.link && (
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                    View Product
                  </a>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  className="w-8 h-8 rounded-lg bg-gray-100 text-dark flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  -
                </button>
                <span className="w-8 text-center font-medium text-dark">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  className="w-8 h-8 rounded-lg bg-gray-100 text-dark flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="text-gray-light hover:text-red-500 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray">Items</span>
            <span className="text-sm text-gray">{items.reduce((s, i) => s + i.quantity, 0)} items</span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray font-medium">Total</span>
            <span className="text-2xl font-bold text-dark">${total.toFixed(2)}</span>
          </div>
          <p className="text-xs text-gray-light text-center">
            Prices are estimated. Click "View Product" on each item to purchase from the brand's website.
          </p>
        </div>
      </div>
    </div>
  )
}
