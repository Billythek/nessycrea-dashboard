'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import {
  CreditCard,
  Search,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  TrendingUp,
  AlertCircle
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency } from '@/lib/utils'
import { log } from '@/lib/logger'
import type { ComponentType } from 'react'

interface Payment {
  id: string
  transaction_id: string
  amount: number
  currency: string
  provider: string
  payment_status: string
  payer_name?: string
  payer_email?: string
  completed_at?: string
  created_at: string
  contacts: {
    username: string
    full_name?: string
  } | null
  orders: {
    order_number: string
  } | null
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [providerFilter, setProviderFilter] = useState<string>('all')

  useEffect(() => {
    fetchPayments()
  }, [])

  useEffect(() => {
    filterPayments()
  }, [payments, searchQuery, statusFilter, providerFilter])

  async function fetchPayments() {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          id,
          transaction_id,
          amount,
          currency,
          provider,
          payment_status,
          payer_name,
          payer_email,
          completed_at,
          created_at,
          orders!inner (
            order_number,
            contacts (
              username,
              full_name
            )
          )
        `)
        .order('created_at', { ascending: false })
        .limit(100)

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      // Transform data: Extract contacts from orders and flatten structure
      const transformedData = data?.map(payment => ({
        ...payment,
        orders: Array.isArray(payment.orders) && payment.orders.length > 0
          ? payment.orders[0]
          : null,
        contacts: Array.isArray(payment.orders) && payment.orders.length > 0 && payment.orders[0].contacts
          ? (Array.isArray(payment.orders[0].contacts) ? payment.orders[0].contacts[0] : payment.orders[0].contacts)
          : null
      })) || []

      setPayments(transformedData)
      setFilteredPayments(transformedData)
    } catch (error) {
      log.error('Erreur lors du chargement des paiements', error)
    } finally {
      setLoading(false)
    }
  }

  function filterPayments() {
    let filtered = [...payments]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (payment) =>
          payment.transaction_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          payment.contacts?.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          payment.payer_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          payment.orders?.order_number.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((payment) => payment.payment_status === statusFilter)
    }

    // Provider filter
    if (providerFilter !== 'all') {
      filtered = filtered.filter((payment) => payment.provider === providerFilter)
    }

    setFilteredPayments(filtered)
  }

  const stats = {
    total: payments.length,
    revenue: payments
      .filter((p) => p.payment_status === 'completed')
      .reduce((sum, payment) => sum + Number(payment.amount), 0),
    completed: payments.filter((p) => p.payment_status === 'completed').length,
    pending: payments.filter((p) => p.payment_status === 'pending').length,
    failed: payments.filter((p) => p.payment_status === 'failed').length,
    refunded: payments.filter((p) => p.payment_status === 'refunded').length,
  }

  function getStatusBadge(status: string) {
    const statusConfig: Record<
      string,
      { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: ComponentType<{ className?: string }> }
    > = {
      completed: { label: 'Complété', variant: 'default', icon: CheckCircle2 },
      pending: { label: 'En attente', variant: 'secondary', icon: Clock },
      failed: { label: 'Échoué', variant: 'destructive', icon: XCircle },
      refunded: { label: 'Remboursé', variant: 'outline', icon: AlertCircle },
    }

    const config = statusConfig[status] || {
      label: status,
      variant: 'outline' as const,
      icon: Clock,
    }
    const Icon = config.icon

    return (
      <Badge variant={config.variant}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  function getProviderBadge(provider: string) {
    const providerConfig: Record<string, { label: string; color: string }> = {
      paypal: { label: 'PayPal', color: 'bg-blue-100 text-blue-700' },
      stripe: { label: 'Stripe', color: 'bg-purple-100 text-purple-700' },
      bank_transfer: { label: 'Virement', color: 'bg-gray-100 text-gray-700' },
    }

    const config = providerConfig[provider] || { label: provider, color: 'bg-gray-100 text-gray-700' }

    return <Badge className={config.color}>{config.label}</Badge>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Paiements</h1>
        <p className="text-muted-foreground">Suivez tous vos paiements et transactions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <CreditCard className="h-8 w-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Revenus</p>
              <p className="text-2xl font-bold">{formatCurrency(stats.revenue)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Complétés</p>
              <p className="text-2xl font-bold">{stats.completed}</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">En attente</p>
              <p className="text-2xl font-bold">{stats.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Échoués</p>
              <p className="text-2xl font-bold">{stats.failed}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
        </Card>
      </div>

      {/* Filters & Search */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher par transaction, contact ou commande..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="completed">Complétés</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="failed">Échoués</SelectItem>
              <SelectItem value="refunded">Remboursés</SelectItem>
            </SelectContent>
          </Select>

          {/* Provider Filter */}
          <Select value={providerFilter} onValueChange={setProviderFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Fournisseur" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="paypal">PayPal</SelectItem>
              <SelectItem value="stripe">Stripe</SelectItem>
              <SelectItem value="bank_transfer">Virement</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Payments Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px] min-w-[150px]">Transaction ID</TableHead>
                <TableHead className="w-[150px] min-w-[150px]">Client</TableHead>
                <TableHead className="w-[120px] min-w-[120px]">Commande</TableHead>
                <TableHead className="w-[120px] min-w-[120px]">Montant</TableHead>
                <TableHead className="w-[100px] min-w-[100px]">Fournisseur</TableHead>
                <TableHead className="w-[120px] min-w-[120px]">Statut</TableHead>
                <TableHead className="w-[150px] min-w-[150px]">Date</TableHead>
                <TableHead className="w-[50px] min-w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
          <TableBody>
            {filteredPayments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  Aucun paiement trouvé
                </TableCell>
              </TableRow>
            ) : (
              filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-mono text-sm">
                    {payment.transaction_id.length > 20
                      ? `${payment.transaction_id.substring(0, 20)}...`
                      : payment.transaction_id}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-semibold">@{payment.contacts?.username}</p>
                      {payment.payer_name && (
                        <p className="text-xs text-muted-foreground">{payment.payer_name}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {payment.orders?.order_number || (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrency(Number(payment.amount), payment.currency)}
                  </TableCell>
                  <TableCell>{getProviderBadge(payment.provider)}</TableCell>
                  <TableCell>{getStatusBadge(payment.payment_status)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(
                      payment.completed_at || payment.created_at
                    ).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Voir les détails</DropdownMenuItem>
                        <DropdownMenuItem>Voir la commande</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {payment.payment_status === 'completed' && (
                          <DropdownMenuItem className="text-destructive">
                            Rembourser
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          </Table>
        </div>
      </Card>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Affichage de {filteredPayments.length} paiement(s) sur {payments.length}
      </div>
    </div>
  )
}
