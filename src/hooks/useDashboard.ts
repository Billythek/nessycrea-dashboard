import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { DailySales, Activity, Review, OrderItem } from '@/lib/supabase'
import { log } from '@/lib/logger'
import { transformOrderItemWithOrder } from '@/lib/supabase-helpers'
import type { SupabaseOrderItemWithOrder } from '@/lib/types'

export interface DashboardStats {
  totalMessages: number
  unreadMessages: number
  totalOrders: number
  revenue: number
  conversionRate: number
  avgResponseTime: number
  avgRating: number
}

export interface RevenueData {
  date: string
  'Chiffre d\'affaires': number
}

export interface ProductData {
  name: string
  'Ventes': number
}

export interface OrderStatusData {
  name: string
  value: number
}

export interface RatingDistribution {
  rating: number
  count: number
  percentage: number
}

async function fetchDashboardStats(): Promise<DashboardStats> {
  const [messagesResult, unreadResult, ordersResult, funnelResult, reviewsResult] = await Promise.all([
    supabase.from('messages').select('*', { count: 'exact', head: true }).eq('direction', 'inbound'),
    supabase.from('messages').select('*', { count: 'exact', head: true }).eq('status', 'unread').eq('requires_response', true),
    supabase.from('orders').select('total_amount, status', { count: 'exact' }).in('status', ['paid', 'processing', 'shipped', 'delivered']),
    supabase.from('conversion_funnel').select('conversion_rate').single(),
    supabase.from('reviews').select('rating')
  ])

  const revenue = ordersResult.data?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0
  const avgRating = reviewsResult.data && reviewsResult.data.length > 0
    ? reviewsResult.data.reduce((sum, r) => sum + r.rating, 0) / reviewsResult.data.length
    : 0

  return {
    totalMessages: messagesResult.count || 0,
    unreadMessages: unreadResult.count || 0,
    totalOrders: ordersResult.count || 0,
    revenue,
    conversionRate: funnelResult.data?.conversion_rate || 0,
    avgResponseTime: 0,
    avgRating
  }
}

async function fetchRevenueData(): Promise<RevenueData[]> {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data } = await supabase
    .from('daily_sales')
    .select('sale_date, revenue')
    .gte('sale_date', thirtyDaysAgo.toISOString())
    .order('sale_date', { ascending: true })

  if (!data) return []

  return data.map(d => ({
    date: new Date(d.sale_date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
    'Chiffre d\'affaires': Number(d.revenue)
  }))
}

async function fetchTopProducts(): Promise<ProductData[]> {
  try {
    const { data: orderItems, error } = await supabase
      .from('order_items')
      .select(`
        product_name,
        quantity,
        order_id,
        orders!inner(status)
      `)

    if (error) {
      log.supabaseError('fetchTopProducts', error)
      return []
    }

    if (!orderItems) return []

    // Filtrer uniquement les commandes payées/traitées
    const filteredItems = orderItems.filter((item) => {
      const typedItem = item as unknown as SupabaseOrderItemWithOrder
      return typedItem.orders?.status && ['paid', 'processing', 'shipped', 'delivered'].includes(typedItem.orders.status)
    })

    const productCounts: Record<string, number> = {}
    filteredItems.forEach((item) => {
      const typedItem = item as unknown as SupabaseOrderItemWithOrder
      const transformedItem = transformOrderItemWithOrder(typedItem)
      const name = transformedItem.product_name || 'Produit'
      productCounts[name] = (productCounts[name] || 0) + transformedItem.quantity
    })

    return Object.entries(productCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, 'Ventes': count }))
  } catch (error) {
    log.error('Erreur lors du chargement des produits top', error)
    return []
  }
}

async function fetchOrderStatus(): Promise<OrderStatusData[]> {
  const { data } = await supabase.from('orders').select('status')

  if (!data) return []

  const statusCounts: Record<string, number> = {}
  data.forEach(order => {
    statusCounts[order.status] = (statusCounts[order.status] || 0) + 1
  })

  const statusLabels: Record<string, string> = {
    paid: 'Payées',
    processing: 'En cours',
    shipped: 'Expédiées',
    delivered: 'Livrées',
    pending: 'En attente',
    pending_payment: 'Paiement en attente',
    draft: 'Brouillons',
    cancelled: 'Annulées',
  }

  return Object.entries(statusCounts).map(([status, count]) => ({
    name: statusLabels[status] || status,
    value: count
  }))
}

async function fetchRecentActivity(): Promise<Activity[]> {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        id,
        message_text,
        direction,
        status,
        received_at,
        contacts (username)
      `)
      .order('received_at', { ascending: false })
      .limit(5)

    if (error) {
      log.supabaseError('fetchRecentActivity', error)
      return []
    }

    // Transformer les données pour correspondre au type Activity
    const transformedData = (data || []).map((item) => ({
      ...item,
      contacts: Array.isArray(item.contacts) && item.contacts.length > 0
        ? item.contacts[0]
        : (item.contacts || null),
    }))

    return (transformedData as Activity[]) || []
  } catch (error) {
    log.error('Erreur lors du chargement de l\'activité récente', error)
    return []
  }
}

async function fetchRatingDistribution(): Promise<RatingDistribution[]> {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('rating')

    if (error) {
      log.supabaseError('fetchRatingDistribution', error)
      return []
    }

    if (!data || data.length === 0) {
      return []
    }

    const total = data.length
    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }

    data.forEach((review) => {
      const rating = review.rating
      if (rating >= 1 && rating <= 5) {
        distribution[rating] = (distribution[rating] || 0) + 1
      }
    })

    return [5, 4, 3, 2, 1].map((rating) => ({
      rating,
      count: distribution[rating] || 0,
      percentage: total > 0 ? ((distribution[rating] || 0) / total) * 100 : 0,
    }))
  } catch (error) {
    log.error('Erreur lors du chargement de la distribution des notes', error)
    return []
  }
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: fetchDashboardStats,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useRevenueData() {
  return useQuery({
    queryKey: ['dashboard', 'revenue'],
    queryFn: fetchRevenueData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useTopProducts() {
  return useQuery({
    queryKey: ['dashboard', 'products'],
    queryFn: fetchTopProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useOrderStatus() {
  return useQuery({
    queryKey: ['dashboard', 'orderStatus'],
    queryFn: fetchOrderStatus,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useRecentActivity() {
  return useQuery({
    queryKey: ['dashboard', 'activity'],
    queryFn: fetchRecentActivity,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

export function useRatingDistribution() {
  return useQuery({
    queryKey: ['dashboard', 'ratingDistribution'],
    queryFn: fetchRatingDistribution,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
