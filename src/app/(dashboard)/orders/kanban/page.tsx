'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Card } from '@/components/ui/card'
import { KanbanBoard, type KanbanStatus } from '@/components/advanced'
import { FadeInText } from '@/components/magic'
import { toast } from 'react-hot-toast'
import { log } from '@/lib/logger'
import { normalizeContact, handleSupabaseError } from '@/lib/supabase-helpers'
import type { SupabaseOrder } from '@/lib/types'

interface Order {
  id: string
  order_number: string
  total_amount: number
  status: string
  created_at: string
  contacts: {
    username: string
    full_name?: string | null
  } | null
}

export default function OrdersKanbanPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = useCallback(async () => {
    try {
      const { data: ordersData, error } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          total_amount,
          status,
          created_at,
          contacts (
            username,
            full_name
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      // Transformer les donn?es pour correspondre ? l'interface Order
      const transformedOrders = (ordersData || []).map((order: SupabaseOrder) => ({
        ...order,
        contacts: normalizeContact(order.contacts),
      }))

      setOrders(transformedOrders)
      log.info(`Commandes charg?es pour Kanban: ${transformedOrders.length}`)
    } catch (error) {
      log.error('Erreur lors du chargement des commandes', error)
      const errorMessage = handleSupabaseError(error, 'le chargement des commandes')
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const handleStatusChange = useCallback(async (orderId: string, newStatus: KanbanStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)

      if (error) {
        throw error
      }

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      )

      toast.success('Statut de la commande mis ? jour')
      log.info(`Statut de la commande ${orderId} mis ? jour: ${newStatus}`)
    } catch (error) {
      log.error('Erreur lors de la mise ? jour du statut de la commande', error)
      toast.error('Erreur lors de la mise ? jour')
    }
  }, [])

  const kanbanItems = orders.map((order) => ({
    id: order.id,
    title: `Commande #${order.order_number}`,
    description: order.contacts?.full_name || order.contacts?.username || 'Client',
    status: (order.status as KanbanStatus) || 'draft',
    metadata: {
      amount: order.total_amount,
      date: order.created_at,
      customer: order.contacts?.username,
    },
  }))

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Vue Kanban</h1>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          <FadeInText text="Vue Kanban des Commandes" delay={0.1} />
        </h1>
        <p className="text-muted-foreground">
          <FadeInText text="Visualisez et g?rez vos commandes par statut" delay={0.2} />
        </p>
      </div>

      {/* Kanban Board */}
      <Card className="p-6 bg-card border border-white/10">
        <KanbanBoard
          items={kanbanItems}
          onStatusChange={handleStatusChange}
          onItemClick={(item) => {
            // Rediriger vers la page de d?tail de la commande
            window.location.href = `/orders?order=${item.id}`
          }}
        />
      </Card>
    </div>
  )
}
