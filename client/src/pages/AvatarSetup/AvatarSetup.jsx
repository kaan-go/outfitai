import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useUserStore } from '../../store/userStore'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const bodyTypes = ['Slim', 'Athletic', 'Average', 'Curvy', 'Plus Size']
const genders = ['Male', 'Female']
const skinTones = ['#F5D6B8', '#E8B98A', '#D4945A', '#A0714F', '#6B4226', '#3D2215']

export default function AvatarSetup() {
  const [mode, setMode] = useState(null)
  const [photo, setPhoto] = useState(null)
  const [bodyData, setBodyData] = useState({
    height: '',
    weight: '',
    bodyType: '',
    gender: '',
    skinTone: '',
  })
  const [uploading, setUploading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null)
  const [statusText, setStatusText] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { user, updateProfile } = useUserStore()

  const uploadPhoto = async () => {
    if (!photo) return
    setUploading(true)

    const path = `${user.id}/avatar-${Date.now()}.${photo.name.split('.').pop()}`
    const { error: uploadErr } = await supabase.storage.from('avatars').upload(path, photo)

    let avatarUrl = null
    if (!uploadErr) {
      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      avatarUrl = data.publicUrl
    }

    await updateProfile({ photos_uploaded: true, avatar_url: avatarUrl })
    setUploading(false)
    navigate('/generator')
  }

  const pollAvatarTask = async (token) => {
    const maxAttempts = 60
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise((r) => setTimeout(r, 3000))

      const res = await fetch(`${API_BASE}/api/avatar/task/${token}`)
      const data = await res.json()

      if (data.status === 'task_postprocess_end' && data.imageUrl) {
        return data.imageUrl
      }
      if (data.status === 'task_cancel' || data.status === 'task_error') {
        throw new Error('Avatar generation failed')
      }

      const statusMap = {
        task_queue: 'Waiting in queue...',
        task_accept: 'Task accepted...',
        task_preprocess_start: 'Preprocessing...',
        task_assign: 'GPU assigned...',
        task_start: 'Generating avatar...',
        task_end: 'Finalizing...',
        task_postprocess_start: 'Post-processing...',
      }
      setStatusText(statusMap[data.status] || 'Processing...')
    }
    throw new Error('Avatar generation timed out')
  }

  const generateAvatar = async () => {
    const { height, weight, gender, bodyType, skinTone } = bodyData
    if (!gender || !bodyType) {
      setError('Please select gender and body type')
      return
    }

    setGenerating(true)
    setError('')
    setGeneratedImageUrl(null)
    setStatusText('Starting avatar generation...')

    try {
      const res = await fetch(`${API_BASE}/api/avatar/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          height: height ? parseInt(height) : 170,
          weight: weight ? parseInt(weight) : 70,
          gender,
          bodyType,
          skinTone,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Generation failed')

      setStatusText('Waiting for AI to generate...')
      const imageUrl = await pollAvatarTask(data.socketToken)

      setGeneratedImageUrl(imageUrl)
      setStatusText('')
    } catch (err) {
      setError(err.message || 'Something went wrong')
      setStatusText('')
    } finally {
      setGenerating(false)
    }
  }

  const saveGeneratedAvatar = async () => {
    if (!generatedImageUrl) return
    setUploading(true)

    const { height, weight, gender, bodyType, skinTone } = bodyData

    await supabase.from('avatars').insert({
      user_id: user.id,
      height: height ? parseInt(height) : null,
      weight: weight ? parseInt(weight) : null,
      gender,
      body_type: bodyType,
      skin_tone: skinTone,
      image_url: generatedImageUrl,
    })

    await updateProfile({
      height: height ? parseInt(height) : null,
      weight: weight ? parseInt(weight) : null,
      body_type: bodyType,
      gender,
      skin_tone: skinTone,
      avatar_url: generatedImageUrl,
      photos_uploaded: false,
    })

    setUploading(false)
    navigate('/generator')
  }

  // --- Mode selection screen ---
  if (!mode) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-surface pt-16">
        <div className="w-full max-w-lg text-center">
          <h1 className="text-3xl font-bold text-dark mb-3">Create Your Avatar</h1>
          <p className="text-gray mb-10">Choose how you'd like to set up your body profile.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => setMode('photo')}
              className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-primary hover:shadow-lg transition-all group"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-dark mb-1">Upload Photo</h3>
              <p className="text-sm text-gray">Upload a full-body photo for your avatar</p>
            </button>
            <button
              onClick={() => setMode('manual')}
              className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-primary hover:shadow-lg transition-all group"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-dark mb-1">Generate Avatar</h3>
              <p className="text-sm text-gray">AI generates a body from your measurements</p>
            </button>
          </div>
          <button onClick={() => navigate('/generator')} className="mt-6 text-sm text-gray hover:text-dark transition-colors">
            Skip for now
          </button>
        </div>
      </div>
    )
  }

  // --- Photo upload screen ---
  if (mode === 'photo') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-surface pt-20 pb-10">
        <div className="w-full max-w-md">
          <button onClick={() => setMode(null)} className="text-sm text-gray hover:text-dark mb-4 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back
          </button>
          <h1 className="text-2xl font-bold text-dark mb-2">Upload Your Photo</h1>
          <p className="text-gray mb-8">Upload a full-body photo to create your avatar.</p>
          <label className="block aspect-[3/4] max-w-sm mx-auto bg-white rounded-2xl border-2 border-dashed border-gray-200 hover:border-primary cursor-pointer transition-colors overflow-hidden mb-8">
            {photo ? (
              <img src={URL.createObjectURL(photo)} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <svg className="w-14 h-14 text-gray-light mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-sm font-medium text-gray">Click to upload photo</span>
                <span className="text-xs text-gray-light mt-1">Full-body photo recommended</span>
              </div>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => setPhoto(e.target.files[0])} />
          </label>
          <button
            onClick={uploadPhoto}
            disabled={uploading || !photo}
            className="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Create Avatar'}
          </button>
        </div>
      </div>
    )
  }

  // --- Manual body profile + AI generation screen ---
  return (
    <div className="min-h-screen bg-surface pt-20 pb-10 px-4">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => { setMode(null); setGeneratedImageUrl(null); setError('') }} className="text-sm text-gray hover:text-dark mb-4 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>
        <h1 className="text-2xl font-bold text-dark mb-2">Generate Your Avatar</h1>
        <p className="text-gray mb-8">Fill in your details and AI will create a realistic body avatar for you.</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">Height (cm)</label>
                <input
                  type="number"
                  value={bodyData.height}
                  onChange={(e) => setBodyData({ ...bodyData, height: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  placeholder="175"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">Weight (kg)</label>
                <input
                  type="number"
                  value={bodyData.weight}
                  onChange={(e) => setBodyData({ ...bodyData, weight: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  placeholder="70"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-2">Gender</label>
              <div className="flex gap-2">
                {genders.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setBodyData({ ...bodyData, gender: g })}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                      bodyData.gender === g ? 'bg-primary text-white' : 'bg-gray-50 text-gray hover:bg-gray-100'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-2">Body Type</label>
              <div className="flex flex-wrap gap-2">
                {bodyTypes.map((bt) => (
                  <button
                    key={bt}
                    type="button"
                    onClick={() => setBodyData({ ...bodyData, bodyType: bt })}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      bodyData.bodyType === bt ? 'bg-primary text-white' : 'bg-gray-50 text-gray hover:bg-gray-100'
                    }`}
                  >
                    {bt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-2">Skin Tone</label>
              <div className="flex gap-3">
                {skinTones.map((tone) => (
                  <button
                    key={tone}
                    type="button"
                    onClick={() => setBodyData({ ...bodyData, skinTone: tone })}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      bodyData.skinTone === tone ? 'border-primary scale-110' : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: tone }}
                  />
                ))}
              </div>
            </div>

            {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}

            <button
              onClick={generateAvatar}
              disabled={generating || !bodyData.gender || !bodyData.bodyType}
              className="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {generating ? 'Generating...' : 'Generate Avatar'}
            </button>
          </div>

          {/* Preview */}
          <div className="flex flex-col items-center">
            <div className="w-full aspect-[3/4] bg-white rounded-2xl border border-gray-100 overflow-hidden flex items-center justify-center">
              {generating ? (
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray font-medium">Generating your avatar...</p>
                  <p className="text-sm text-gray-light mt-1">{statusText}</p>
                </div>
              ) : generatedImageUrl ? (
                <img src={generatedImageUrl} alt="Generated avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center px-8">
                  <svg className="w-20 h-20 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <p className="text-gray font-medium">Avatar preview</p>
                  <p className="text-sm text-gray-light mt-1">Fill in your details and click Generate</p>
                </div>
              )}
            </div>

            {generatedImageUrl && (
              <div className="w-full mt-4 space-y-2">
                <button
                  onClick={saveGeneratedAvatar}
                  disabled={uploading}
                  className="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  {uploading ? 'Saving...' : 'Use This Avatar'}
                </button>
                <button
                  onClick={generateAvatar}
                  disabled={generating}
                  className="w-full py-3 bg-white text-gray font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Regenerate
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
