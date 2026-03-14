import { useState, useRef } from 'react'
import PromptPanel from '../../components/PromptPanel/PromptPanel'
import OutfitCard from '../../components/OutfitCard/OutfitCard'
import ProductCard from '../../components/ProductCard/ProductCard'
import { useUserStore } from '../../store/userStore'
import { supabase } from '../../lib/supabase'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const mockProducts = [
  { id: 1, name: 'Oversized Cotton Hoodie', brand: 'Nike', price: 89.99, image: null },
  { id: 2, name: 'Cargo Utility Pants', brand: 'Zara', price: 49.99, image: null },
  { id: 3, name: 'Air Force 1 White', brand: 'Nike', price: 119.99, image: null },
]

export default function Generator() {
  const [generatedImage, setGeneratedImage] = useState(null)
  const [currentPrompt, setCurrentPrompt] = useState('')
  const [liked, setLiked] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showProducts, setShowProducts] = useState(false)
  const [error, setError] = useState('')
  const [statusText, setStatusText] = useState('')
  const lastPromptData = useRef(null)
  const { user } = useUserStore()

  const handleGenerate = async ({ prompt, personImage, clothingImage, avatarUrl }) => {
    setIsLoading(true)
    setLiked(null)
    setShowProducts(false)
    setGeneratedImage(null)
    setError('')
    setCurrentPrompt(prompt)
    setStatusText('Starting generation...')
    lastPromptData.current = { prompt, personImage, clothingImage, avatarUrl }

    try {
      const formData = new FormData()
      formData.append('prompt', prompt)

      if (personImage) {
        formData.append('inputImage', personImage)
      } else if (avatarUrl) {
        formData.append('inputImageUrl', avatarUrl)
      }

      if (clothingImage) {
        formData.append('inputImage', clothingImage)
      }

      const runRes = await fetch(`${API_BASE}/api/generate`, {
        method: 'POST',
        body: formData,
      })

      const runData = await runRes.json()

      if (!runRes.ok) {
        throw new Error(runData.error || 'Generation failed')
      }

      setStatusText('Waiting for AI to generate...')

      const imageUrl = await pollTask(runData.socketToken)

      setGeneratedImage(imageUrl)
      setStatusText('')

      if (user) {
        await supabase.from('generations').insert({
          user_id: user.id,
          prompt,
          image_url: imageUrl,
        })
      }
    } catch (err) {
      setError(err.message || 'Something went wrong')
      setStatusText('')
    } finally {
      setIsLoading(false)
    }
  }

  const pollTask = async (token) => {
    const maxAttempts = 60

    for (let i = 0; i < maxAttempts; i++) {
      await new Promise((r) => setTimeout(r, 3000))

      const res = await fetch(`${API_BASE}/api/task/${token}`)
      const data = await res.json()

      if (data.status === 'task_postprocess_end' && data.imageUrl) {
        return data.imageUrl
      }

      if (data.status === 'task_cancel' || data.status === 'task_error') {
        throw new Error('Generation failed or was cancelled')
      }

      const statusMap = {
        task_queue: 'Waiting in queue...',
        task_accept: 'Task accepted...',
        task_preprocess_start: 'Preprocessing...',
        task_preprocess_end: 'Preprocessing done...',
        task_assign: 'GPU assigned...',
        task_start: 'Generating outfit...',
        task_end: 'Finalizing...',
        task_postprocess_start: 'Post-processing...',
      }

      setStatusText(statusMap[data.status] || 'Processing...')
    }

    throw new Error('Generation timed out')
  }

  const handleLike = async () => {
    setLiked(true)
    setShowProducts(true)
  }

  const handleDislike = () => {
    setLiked(false)
    setShowProducts(false)
  }

  const handleRegenerate = () => {
    if (lastPromptData.current) {
      handleGenerate(lastPromptData.current)
    }
  }

  return (
    <div className="min-h-screen bg-surface pt-20 pb-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-dark mb-8">Outfit Generator</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <PromptPanel onGenerate={handleGenerate} isLoading={isLoading} />
          </div>

          <div className="lg:col-span-2">
            {error && (
              <div className="mb-4 p-4 bg-red-50 text-red-600 text-sm rounded-xl">{error}</div>
            )}

            {isLoading ? (
              <div className="aspect-[3/4] max-w-md mx-auto bg-white rounded-2xl border border-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray font-medium">Generating your outfit...</p>
                  <p className="text-sm text-gray-light mt-1">{statusText}</p>
                </div>
              </div>
            ) : currentPrompt ? (
              <div className="space-y-8">
                <div className="max-w-md mx-auto">
                  <OutfitCard
                    imageUrl={generatedImage}
                    prompt={currentPrompt}
                    liked={liked}
                    onLike={handleLike}
                    onDislike={handleDislike}
                    onRegenerate={handleRegenerate}
                  />
                </div>

                {showProducts && (
                  <div>
                    <h2 className="text-xl font-bold text-dark mb-4">Shop Similar Items</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {mockProducts.map((product) => (
                        <ProductCard
                          key={product.id}
                          {...product}
                          onAddToCart={() => {}}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-[3/4] max-w-md mx-auto bg-white rounded-2xl border border-gray-100 flex items-center justify-center">
                <div className="text-center px-8">
                  <svg className="w-20 h-20 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <p className="text-gray font-medium">Your outfit will appear here</p>
                  <p className="text-sm text-gray-light mt-1">Upload a photo, write a prompt, and click Generate</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
