import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import { log } from '@/lib/logger'

interface NotificationState {
  unreadMessages: number
  pendingOrders: number
  isLoading: boolean
  lastUpdated: Date | null

  // Actions
  fetchNotifications: () => Promise<void>
  markMessagesAsRead: (count: number) => void
  markOrdersAsProcessed: (count: number) => void
  reset: () => void
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  unreadMessages: 0,
  pendingOrders: 0,
  isLoading: false,
  lastUpdated: null,

  fetchNotifications: async () => {
    set({ isLoading: true })

    try {
      // Fetch unread messages
      const { count: unreadCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'unread')
        .eq('requires_response', true)

      // Fetch pending orders
      const { count: pendingCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .in('status', ['draft', 'pending_payment'])

      set({
        unreadMessages: unreadCount || 0,
        pendingOrders: pendingCount || 0,
        lastUpdated: new Date(),
        isLoading: false,
      })
      log.debug(`Notifications mises ? jour: ${unreadCount || 0} messages non lus, ${pendingCount || 0} commandes en attente`)
    } catch (error) {
      log.error('Erreur lors du chargement des notifications', error)
      set({ isLoading: false })
    }
  },

  markMessagesAsRead: (count: number) => {
    set((state) => ({
      unreadMessages: Math.max(0, state.unreadMessages - count),
    }))
  },

  markOrdersAsProcessed: (count: number) => {
    set((state) => ({
      pendingOrders: Math.max(0, state.pendingOrders - count),
    }))
  },

  reset: () => {
    set({
      unreadMessages: 0,
      pendingOrders: 0,
      isLoading: false,
      lastUpdated: null,
    })
  },
}))
