import { Link } from 'react-router-dom'

const mockOrders = [
  {
    id: 'ORD-001',
    date: '2026-03-14',
    total: 259.97,
    status: 'Delivered',
    items: [
      { name: 'Oversized Cotton Hoodie', brand: 'Nike', price: 89.99, quantity: 1 },
      { name: 'Cargo Utility Pants', brand: 'Zara', price: 49.99, quantity: 2 },
      { name: 'Air Force 1 White', brand: 'Nike', price: 119.99, quantity: 1 },
    ],
  },
  {
    id: 'ORD-002',
    date: '2026-03-10',
    total: 89.99,
    status: 'Processing',
    items: [
      { name: 'Slim Fit Blazer', brand: 'H&M', price: 89.99, quantity: 1 },
    ],
  },
]

const statusColors = {
  Delivered: 'bg-green-100 text-green-700',
  Processing: 'bg-amber-100 text-amber-700',
  Shipped: 'bg-blue-100 text-blue-700',
  Cancelled: 'bg-red-100 text-red-700',
}

export default function Orders() {
  if (mockOrders.length === 0) {
    return (
      <div className="min-h-screen bg-surface pt-20 pb-10 px-4">
        <div className="max-w-2xl mx-auto text-center py-20">
          <svg className="w-20 h-20 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h2 className="text-xl font-bold text-dark mb-2">No orders yet</h2>
          <p className="text-gray mb-6">Generate outfits and shop to see your orders here.</p>
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
        <h1 className="text-3xl font-bold text-dark mb-8">Order History</h1>

        <div className="space-y-4">
          {mockOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="p-5 flex items-center justify-between border-b border-gray-50">
                <div>
                  <p className="font-bold text-dark">{order.id}</p>
                  <p className="text-xs text-gray mt-0.5">{order.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                  <span className="font-bold text-dark">${order.total.toFixed(2)}</span>
                </div>
              </div>
              <div className="p-5">
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <div>
                        <span className="text-dark font-medium">{item.name}</span>
                        <span className="text-gray ml-2">x{item.quantity}</span>
                      </div>
                      <span className="text-gray">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
