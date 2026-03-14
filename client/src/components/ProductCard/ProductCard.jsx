export default function ProductCard({ name, brand, image, price, url, onAddToCart }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="aspect-square bg-gray-50 overflow-hidden">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-light">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-primary font-semibold uppercase tracking-wide mb-1">{brand}</p>
        <h3 className="text-sm font-medium text-dark mb-2 line-clamp-2">{name}</h3>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-dark">${price}</span>
          <button
            onClick={onAddToCart}
            className="px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary-dark transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
