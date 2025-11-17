'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { ColumnDef } from '@tanstack/react-table'
import {
  Package,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  DollarSign,
  ShoppingCart,
  User,
  MapPin,
  Calendar,
  ChevronDown,
  ChevronRight
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AdvancedDataTable, SortableHeader, Timeline, TimelineItem } from '@/components/advanced'
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/lib/utils'
import { log } from '@/lib/logger'
import { transformOrders, handleSupabaseError } from '@/lib/supabase-helpers'
import type { OrderWithItems, SupabaseOrderItem } from '@/lib/types'
import type { Order } from '@/lib/supabase'
import type { ComponentType } from 'react'

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Récupérer les commandes avec les contacts
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          total_amount,
          status,
          created_at,
          shipping_address,
          contacts (
            username,
            full_name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(100)

      if (ordersError) {
        const errorMessage = handleSupabaseError(ordersError, 'le chargement des commandes')
        setError(errorMessage)
        setOrders([])
        return
      }

      // Récupérer les order_items séparément
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*')

      if (itemsError) {
        log.warn('Erreur lors du chargement des items de commande', itemsError)
      }

      // Transformer les données avec les helpers typés
      const transformedData = transformOrders(
        (ordersData || []) as unknown as OrderWithItems[],
        (itemsData || []) as SupabaseOrderItem[]
      )

      setOrders(transformedData)
      log.info(`Commandes chargées: ${transformedData.length}`)
    } catch (error) {
      log.error('Erreur lors du chargement des commandes', error)
      setError('Une erreur est survenue lors du chargement des commandes')
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const updateOrderStatus = useCallback(async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)

      if (error) {
        throw error
      }

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus as Order['status'] } : order
        )
      )
      log.info(`Statut de la commande ${orderId} mis à jour: ${newStatus}`)
    } catch (error) {
      log.error('Erreur lors de la mise à jour du statut de la commande', error)
    }
  }, [])

  const stats = useMemo(() => ({
    total: orders.length,
    revenue: orders.reduce((sum, order) => sum + Number(order.total_amount), 0),
    paid: orders.filter((o) => o.status === 'paid').length,
    processing: orders.filter((o) => o.status === 'processing').length,
    shipped: orders.filter((o) => o.status === 'shipped').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
  }), [orders])

  const deliveryRate = useMemo(() => 
    stats.total > 0 ? (stats.delivered / stats.total) * 100 : 0,
    [stats]
  )

  function getStatusBadge(status: string) {
    const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: ComponentType<{ className?: string }> }> = {
      paid: { label: 'Payée', variant: 'default', icon: CheckCircle2 },
      processing: { label: 'En cours', variant: 'secondary', icon: Clock },
      shipped: { label: 'Expédiée', variant: 'default', icon: Truck },
      delivered: { label: 'Livrée', variant: 'default', icon: CheckCircle2 },
      pending: { label: 'En attente', variant: 'outline', icon: Clock },
      cancelled: { label: 'Annulée', variant: 'destructive', icon: XCircle },
    }

    const config = statusConfig[status] || { label: status, variant: 'outline' as const, icon: Clock }
    const Icon = config.icon

    return (
      <Badge variant={config.variant}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  function getOrderProgress(status: string): number {
    const progressMap: Record<string, number> = {
      pending: 0,
      paid: 25,
      processing: 50,
      shipped: 75,
      delivered: 100,
      cancelled: 0,
    }
    return progressMap[status] || 0
  }

  function getOrderTimeline(order: Order): TimelineItem[] {
    const baseTimeline: TimelineItem[] = [
      {
        id: '1',
        title: 'Commande passée',
        description: `Commande ${order.order_number} créée`,
        timestamp: new Date(order.created_at),
        status: 'completed',
      },
    ]

    if (order.status === 'paid' || order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered') {
      baseTimeline.push({
        id: '2',
        title: 'Paiement reçu',
        description: `${formatCurrency(order.total_amount)} reçu`,
        timestamp: new Date(order.created_at),
        status: 'completed',
      })
    }

    if (order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered') {
      baseTimeline.push({
        id: '3',
        title: 'Préparation en cours',
        description: 'La commande est en cours de préparation',
        timestamp: new Date(order.created_at),
        status: order.status === 'processing' ? 'in-progress' : 'completed',
      })
    }

    if (order.status === 'shipped' || order.status === 'delivered') {
      baseTimeline.push({
        id: '4',
        title: 'Expédiée',
        description: 'La commande a été expédiée',
        timestamp: new Date(order.created_at),
        status: order.status === 'shipped' ? 'in-progress' : 'completed',
      })
    }

    if (order.status === 'delivered') {
      baseTimeline.push({
        id: '5',
        title: 'Livrée',
        description: 'La commande a été livrée',
        timestamp: new Date(order.created_at),
        status: 'completed',
      })
    }

    if (order.status === 'cancelled') {
      baseTimeline.push({
        id: 'cancelled',
        title: 'Commande annulée',
        description: 'La commande a été annulée',
        timestamp: new Date(order.created_at),
        status: 'cancelled',
      })
    }

    return baseTimeline
  }

  function OrderDetailSheet({ order }: { order: OrderWithItems }) {
    const [isProductsOpen, setIsProductsOpen] = useState(true)
    const timeline = getOrderTimeline(order)

    return (
      <SheetContent className="sm:max-w-[640px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Commande {order.order_number}</SheetTitle>
          <SheetDescription>
            {order.contacts?.username ? `@${order.contacts.username}` : 'Client inconnu'}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Status & Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">Statut de la commande</h4>
              {getStatusBadge(order.status)}
            </div>
            <Progress value={getOrderProgress(order.status)} className="h-2" />
            <p className="text-xs text-muted-foreground">{getOrderProgress(order.status)}% complété</p>
          </div>

          {/* Timeline */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Suivi de commande</h4>
            <Timeline items={timeline} variant="compact" />
          </div>

          {/* Products */}
          <Collapsible open={isProductsOpen} onOpenChange={setIsProductsOpen}>
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">Produits ({order.items?.length || 0})</h4>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {isProductsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="space-y-2 mt-3">
              {order.items && Array.isArray(order.items) && order.items.length > 0 ? (
                order.items.map((item, idx: number) => (
                  <Card key={item.id || idx} className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{item.product_name || 'Produit'}</p>
                        <p className="text-sm text-muted-foreground">Quantité: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  </Card>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Aucun produit</p>
              )}
            </CollapsibleContent>
          </Collapsible>

          {/* Customer Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <User className="h-4 w-4" />
              Client
            </h4>
            <Card className="p-4">
              <p className="font-semibold">@{order.contacts?.username}</p>
              {order.contacts?.full_name && (
                <p className="text-sm text-muted-foreground">{order.contacts.full_name}</p>
              )}
            </Card>
          </div>

          {/* Shipping Address */}
          {order.shipping_address && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Adresse de livraison
              </h4>
              <Card className="p-4">
                <p className="text-sm whitespace-pre-wrap">{order.shipping_address}</p>
              </Card>
            </div>
          )}

          {/* Total */}
          <Separator />
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold">Total</h4>
            <p className="text-2xl font-bold">{formatCurrency(order.total_amount)}</p>
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-4">
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => updateOrderStatus(order.id, 'processing')}>
                Marquer en cours
              </Button>
              <Button size="sm" variant="outline" onClick={() => updateOrderStatus(order.id, 'shipped')}>
                Marquer expédiée
              </Button>
              <Button size="sm" variant="default" onClick={() => updateOrderStatus(order.id, 'delivered')}>
                Marquer livrée
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    )
  }

  const columns: ColumnDef<OrderWithItems>[] = [
    {
      accessorKey: 'order_number',
      header: ({ column }) => <SortableHeader column={column}>N° Commande</SortableHeader>,
      cell: ({ row }) => {
        const order = row.original
        return (
          <Sheet>
            <SheetTrigger asChild>
              <button className="font-medium hover:underline">{order.order_number}</button>
            </SheetTrigger>
            <OrderDetailSheet order={order} />
          </Sheet>
        )
      },
    },
    {
      accessorKey: 'contacts',
      header: 'Client',
      cell: ({ row }) => {
        const contact = row.original.contacts
        return (
          <div>
            <p className="font-semibold">@{contact?.username}</p>
            {contact?.full_name && <p className="text-xs text-muted-foreground">{contact.full_name}</p>}
          </div>
        )
      },
    },
    {
      accessorKey: 'items',
      header: 'Produits',
      cell: ({ row }) => {
        const items = row.getValue('items') as SupabaseOrderItem[]
        return items && Array.isArray(items) && items.length > 0 ? (
          <div className="text-sm">
            {items.slice(0, 2).map((item, idx: number) => (
              <div key={item.id || `item-${idx}`} className="text-muted-foreground">{item.quantity}x {item.product_name || 'Produit'}</div>
            ))}
            {items.length > 2 && <div className="text-xs text-muted-foreground">+{items.length - 2} produit(s)</div>}
          </div>
        ) : <span className="text-muted-foreground">-</span>
      },
    },
    {
      accessorKey: 'total_amount',
      header: ({ column }) => <SortableHeader column={column}>Montant</SortableHeader>,
      cell: ({ row }) => <span className="font-semibold">{formatCurrency(Number(row.getValue('total_amount')))}</span>,
    },
    {
      accessorKey: 'status',
      header: 'Statut',
      cell: ({ row }) => getStatusBadge(row.getValue('status')),
    },
    {
      accessorKey: 'created_at',
      header: ({ column }) => <SortableHeader column={column}>Date</SortableHeader>,
      cell: ({ row }) => {
        const date = new Date(row.getValue('created_at'))
        return (
          <div className="text-sm text-muted-foreground">
            {date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
            <br />
            <span className="text-xs">{date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        )
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => updateOrderStatus(row.original.id, 'processing')}>Marquer en cours</DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateOrderStatus(row.original.id, 'shipped')}>Marquer expédiée</DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateOrderStatus(row.original.id, 'delivered')}>Marquer livrée</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Annuler la commande</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6 animate-slide-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Commandes</h1>
          <p className="text-muted-foreground">Gérez toutes vos commandes</p>
        </div>
        <Card className="p-8 bg-card border border-destructive/20">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Package className="h-12 w-12 text-destructive" />
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">Erreur de chargement</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={fetchOrders} variant="outline">
                Réessayer
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-slide-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Commandes</h1>
        <p className="text-muted-foreground">Gérez toutes vos commandes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 card-hover">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Total commandes</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <ShoppingCart className="h-8 w-8 text-primary" />
          </div>
        </Card>

        <Card className="p-4 card-hover">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Chiffre d'affaires</p>
              <p className="text-2xl font-bold">{formatCurrency(stats.revenue)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4 card-hover">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">En traitement</p>
              <p className="text-2xl font-bold">{stats.processing}</p>
              <Badge variant="secondary" className="mt-2 text-xs">
                <Clock className="h-3 w-3 mr-1" />
                {stats.shipped} expédiées
              </Badge>
            </div>
            <Truck className="h-8 w-8 text-orange-500" />
          </div>
        </Card>

        <Card className="p-4 card-hover">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Taux de livraison</p>
              <p className="text-2xl font-bold">{deliveryRate.toFixed(0)}%</p>
              <Progress value={deliveryRate} className="mt-2 h-1.5" />
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
        </Card>
      </div>

      <AdvancedDataTable
        columns={columns}
        data={orders}
        searchKey="order_number"
        searchPlaceholder="Rechercher par numéro de commande ou contact..."
        enableRowSelection={false}
        enableColumnVisibility={true}
        onExport={() => console.log('Export orders')}
      />
    </div>
  )
}
