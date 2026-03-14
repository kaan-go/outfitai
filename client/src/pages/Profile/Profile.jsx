import { useUserStore } from '../../store/userStore'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Profile() {
  const { user, profile } = useUserStore()
  const [stats, setStats] = useState({ generations: 0, liked: 0, orders: 0 })

  useEffect(() => {
    async function fetchStats() {
      if (!user) return

      const [genRes, likedRes, ordersRes] = await Promise.all([
        supabase.from('generations').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('generations').select('id', { count: 'exact', head: true }).eq('user_id', user.id).eq('liked', true),
        supabase.from('orders').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      ])

      setStats({
        generations: genRes.count || 0,
        liked: likedRes.count || 0,
        orders: ordersRes.count || 0,
      })
    }

    fetchStats()
  }, [user])

  return (
    <div className="min-h-screen bg-surface pt-20 pb-10 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-dark mb-8">Profile</h1>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-primary to-primary-dark" />
          <div className="px-8 pb-8">
            <div className="w-20 h-20 bg-white rounded-2xl border-4 border-white shadow-lg flex items-center justify-center -mt-10 mb-4">
              <span className="text-2xl font-bold text-primary">
                {user?.email?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>

            <h2 className="text-xl font-bold text-dark">{user?.email || 'User'}</h2>
            <p className="text-gray text-sm mt-1">
              {profile?.body_type ? `${profile.body_type} build` : 'Free Plan'}
              {profile?.height ? ` - ${profile.height}cm` : ''}
            </p>

            <div className="grid grid-cols-3 gap-4 mt-6 mb-8">
              <div className="bg-surface rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-dark">{stats.generations}</p>
                <p className="text-xs text-gray mt-1">Generations</p>
              </div>
              <div className="bg-surface rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-dark">{stats.liked}</p>
                <p className="text-xs text-gray mt-1">Liked</p>
              </div>
              <div className="bg-surface rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-dark">{stats.orders}</p>
                <p className="text-xs text-gray mt-1">Orders</p>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                to="/avatar-setup"
                className="block w-full py-3 text-center bg-primary/10 text-primary font-medium rounded-xl hover:bg-primary/20 transition-colors"
              >
                Update Avatar
              </Link>
              <button className="w-full py-3 text-center bg-surface text-gray font-medium rounded-xl hover:bg-gray-100 transition-colors">
                Manage Subscription
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
