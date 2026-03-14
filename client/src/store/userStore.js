import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useUserStore = create((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  initialized: false,

  initialize: async () => {
    if (get().initialized) return

    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      set({ user: session.user })
      await get().fetchProfile()
    }
    set({ loading: false, initialized: true })

    supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        set({ user: session.user })
        get().fetchProfile()
      } else {
        set({ user: null, profile: null })
      }
    })
  },

  fetchProfile: async () => {
    const user = get().user
    if (!user) return

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (data) set({ profile: data })
  },

  updateProfile: async (profileData) => {
    const user = get().user
    if (!user) return

    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('user_id', user.id)
      .select()
      .single()

    if (!error && data) set({ profile: data })
    return { data, error }
  },

  logout: async () => {
    await supabase.auth.signOut()
    set({ user: null, profile: null })
  },
}))
