import { supabase } from '../lib/supabase'

export const api = {
  async getHistory() {
    const { data, error } = await supabase
      .from('generations')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async likeGeneration(id, liked) {
    const { data, error } = await supabase
      .from('generations')
      .update({ liked })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async saveGeneration(generationData) {
    const { data, error } = await supabase
      .from('generations')
      .insert(generationData)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getProducts(query) {
    let q = supabase.from('products').select('*')
    if (query) {
      q = q.or(`name.ilike.%${query}%,brand.ilike.%${query}%`)
    }
    const { data, error } = await q
    if (error) throw error
    return data
  },

  async getCart() {
    const { data, error } = await supabase
      .from('cart')
      .select('*, product:products(*)')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async addToCart(productId) {
    const { data: { user } } = await supabase.auth.getUser()

    const { data: existing } = await supabase
      .from('cart')
      .select('id, quantity')
      .eq('product_id', productId)
      .eq('user_id', user.id)
      .single()

    if (existing) {
      const { data, error } = await supabase
        .from('cart')
        .update({ quantity: existing.quantity + 1 })
        .eq('id', existing.id)
        .select()
        .single()
      if (error) throw error
      return data
    }

    const { data, error } = await supabase
      .from('cart')
      .insert({ product_id: productId, user_id: user.id })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateCartQuantity(cartId, quantity) {
    if (quantity <= 0) {
      const { error } = await supabase.from('cart').delete().eq('id', cartId)
      if (error) throw error
      return null
    }

    const { data, error } = await supabase
      .from('cart')
      .update({ quantity })
      .eq('id', cartId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async removeFromCart(cartId) {
    const { error } = await supabase.from('cart').delete().eq('id', cartId)
    if (error) throw error
  },

  async createOrder() {
    const { data: { user } } = await supabase.auth.getUser()

    const cartItems = await api.getCart()
    if (!cartItems.length) throw new Error('Cart is empty')

    const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({ user_id: user.id, total, status: 'pending' })
      .select()
      .single()

    if (orderError) throw orderError

    const orderItems = cartItems.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      price: item.product.price,
      quantity: item.quantity,
    }))

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
    if (itemsError) throw itemsError

    await supabase.from('cart').delete().eq('user_id', user.id)

    return order
  },

  async getOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, product:products(*))')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },
}
