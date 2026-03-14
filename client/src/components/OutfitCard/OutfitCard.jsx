export default function OutfitCard({ imageUrl, prompt, liked, onLike, onDislike, onRegenerate }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 transition-transform hover:scale-[1.02]">
      <div className="aspect-[3/4] bg-gray-100 overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt="Generated outfit" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-light">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
      {prompt && (
        <div className="p-4">
          <p className="text-sm text-gray line-clamp-2 mb-3">{prompt}</p>
          <div className="flex items-center gap-2">
            <button
              onClick={onLike}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                liked === true ? 'bg-green-100 text-green-700' : 'bg-gray-50 text-gray hover:bg-green-50'
              }`}
            >
              👍 Like
            </button>
            <button
              onClick={onDislike}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                liked === false ? 'bg-red-100 text-red-700' : 'bg-gray-50 text-gray hover:bg-red-50'
              }`}
            >
              👎 Dislike
            </button>
            <button
              onClick={onRegenerate}
              className="flex-1 py-2 rounded-lg text-sm font-medium bg-gray-50 text-gray hover:bg-primary/10 hover:text-primary transition-colors"
            >
              🔄 Retry
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
