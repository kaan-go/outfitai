import { useState } from 'react'
import { Link } from 'react-router-dom'

const mockCartItems = [
  { id: 1, name: 'Oversized Cotton Hoodie', brand: 'Nike', price: 89.99, quantity: 1, image: null },
  { id: 2, name: 'Cargo Utility Pants', brand: 'Zara', price: 49.99, quantity: 1, image: null },
]

export default function Cart() {
  const [items, setItems] = useState(mockCartItems)

  const updateQuantity = (id, delta) => {
    setItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item))
        .filter((item) => item.quantity > 0)
    )
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-surface pt-20 pb-10 px-4">
        <div className="max-w-2xl mx-auto text-center py-20">
          <svg className="w-20 h-20 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h2 className="text-xl font-bold text-dark mb-2">Your cart is empty</h2>
          <p className="text-gray mb-6">Generate outfits and add products to get started.</p>
          <Link
            to="/generator"
            className="inline-block px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors"
          >
            Go to Generator
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
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <svg className="w-8 h-8 text-gray-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-primary font-semibold uppercase">{item.brand}</p>
                <h3 className="text-sm font-medium text-dark truncate">{item.name}</h3>
                <p className="text-lg font-bold text-dark mt-1">${item.price}</p>
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
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray">Subtotal</span>
            <span className="text-lg font-bold text-dark">${total.toFixed(2)}</span>
          </div>
          <button className="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors">
            Checkout
          </button>
        </div>
      </div>
    </div>
  )
}
