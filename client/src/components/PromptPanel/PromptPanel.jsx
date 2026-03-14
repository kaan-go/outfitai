import { useState, useEffect } from 'react'
import { useUserStore } from '../../store/userStore'
import { supabase } from '../../lib/supabase'

export default function PromptPanel({ onGenerate, isLoading }) {
  const [prompt, setPrompt] = useState('')
  const [personImage, setPersonImage] = useState(null)
  const [clothingImage, setClothingImage] = useState(null)
  const [imageSource, setImageSource] = useState('upload') // 'upload' | 'avatar'
  const [avatars, setAvatars] = useState([])
  const [selectedAvatar, setSelectedAvatar] = useState(null)
  const { user, profile } = useUserStore()

  useEffect(() => {
    if (!user) return
    supabase
      .from('avatars')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setAvatars(data)
        if (data?.length && !selectedAvatar) setSelectedAvatar(data[0])
      })
  }, [user])

  const hasAvatar = avatars.length > 0
  const hasProfileAvatar = !!profile?.avatar_url

  const getPersonImageInfo = () => {
    if (imageSource === 'avatar' && selectedAvatar) {
      return { avatarUrl: selectedAvatar.image_url }
    }
    if (personImage) {
      return { personImage }
    }
    if (hasProfileAvatar) {
      return { avatarUrl: profile.avatar_url }
    }
    return null
  }

  const hasPersonImage = !!getPersonImageInfo()

  const handleSubmit = (e) => {
    e.preventDefault()
    const imageInfo = getPersonImageInfo()
    if (!prompt.trim() || !imageInfo) return
    onGenerate({
      prompt: prompt.trim(),
      clothingImage,
      personImage: imageInfo.personImage || null,
      avatarUrl: imageInfo.avatarUrl || null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <h2 className="text-lg font-bold text-dark mb-1">Design Your Outfit</h2>
      <p className="text-sm text-gray mb-5">Describe the outfit you want to generate.</p>

      {/* Image source toggle */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-dark mb-2">Your Photo</label>

        {(hasAvatar || hasProfileAvatar) && (
          <div className="flex gap-1 mb-3 bg-gray-50 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setImageSource('upload')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                imageSource === 'upload' ? 'bg-white text-dark shadow-sm' : 'text-gray'
              }`}
            >
              Upload Photo
            </button>
            {hasAvatar && (
              <button
                type="button"
                onClick={() => setImageSource('avatar')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  imageSource === 'avatar' ? 'bg-white text-dark shadow-sm' : 'text-gray'
                }`}
              >
                Generated Avatar
              </button>
            )}
          </div>
        )}

        {imageSource === 'upload' ? (
          <label className="block w-full h-28 rounded-xl border-2 border-dashed border-gray-200 hover:border-primary cursor-pointer transition-colors overflow-hidden">
            {personImage ? (
              <div className="w-full h-full flex items-center gap-3 px-4">
                <img src={URL.createObjectURL(personImage)} alt="" className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-dark truncate">{personImage.name}</p>
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); setPersonImage(null) }}
                    className="text-xs text-red-500 hover:underline mt-0.5"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : hasProfileAvatar ? (
              <div className="w-full h-full flex items-center gap-3 px-4">
                <img src={profile.avatar_url} alt="" className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-dark">Using your avatar</p>
                  <p className="text-xs text-gray">Or click to upload a different photo</p>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <svg className="w-8 h-8 text-gray-light mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-xs text-gray">Upload a full-body photo</span>
              </div>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => setPersonImage(e.target.files[0])} />
          </label>
        ) : (
          <div className="space-y-2">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {avatars.map((av) => (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => setSelectedAvatar(av)}
                  className={`shrink-0 w-20 h-24 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedAvatar?.id === av.id ? 'border-primary scale-105' : 'border-gray-200'
                  }`}
                >
                  <img src={av.image_url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            {selectedAvatar && (
              <p className="text-xs text-gray">
                {selectedAvatar.gender} - {selectedAvatar.body_type} - {selectedAvatar.height}cm
              </p>
            )}
          </div>
        )}
      </div>

      {/* Clothing reference */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-dark mb-2">
          Clothing Reference <span className="text-gray-light font-normal">(optional)</span>
        </label>
        <label className="block w-full h-20 rounded-xl border-2 border-dashed border-gray-200 hover:border-primary cursor-pointer transition-colors overflow-hidden">
          {clothingImage ? (
            <div className="w-full h-full flex items-center gap-3 px-4">
              <img src={URL.createObjectURL(clothingImage)} alt="" className="w-12 h-12 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-dark truncate">{clothingImage.name}</p>
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); setClothingImage(null) }}
                  className="text-xs text-red-500 hover:underline mt-0.5"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <svg className="w-6 h-6 text-gray-light mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="text-xs text-gray">Upload a clothing image</span>
            </div>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={(e) => setClothingImage(e.target.files[0])} />
        </label>
      </div>

      {/* Prompt */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-dark mb-2">Prompt</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={"What do you want to wear?\nWhere will you be?\nWhat's the vibe?\n\nTell us freely, like:\n\"A casual outfit for a coffee date in Paris\""}
          rows={5}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || !prompt.trim() || !hasPersonImage}
        className="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Generating...' : 'Generate Outfit'}
      </button>
    </form>
  )
}
