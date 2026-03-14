import { useState, useEffect } from 'react'
import OutfitCard from '../../components/OutfitCard/OutfitCard'
import { supabase } from '../../lib/supabase'
import { useUserStore } from '../../store/userStore'

export default function History() {
  const [filter, setFilter] = useState('all')
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
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
      <div className="max-w-6xl mx-auto">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {history.map((item) => (
              <div key={item.id}>
                <OutfitCard
                  imageUrl={item.image_url}
                  prompt={item.prompt}
                  liked={item.liked}
                  onLike={() => handleLike(item.id)}
                  onDislike={() => handleDislike(item.id)}
                  onRegenerate={() => {}}
                />
                <p className="text-xs text-gray-light mt-2 text-center">{formatDate(item.created_at)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
