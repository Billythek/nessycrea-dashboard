'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ColumnDef } from '@tanstack/react-table'
import {
  Users,
  MoreHorizontal,
  Mail,
  Phone,
  MessageSquare,
  ShoppingBag,
  Star,
  UserPlus,
  Edit,
  Trash2,
  ExternalLink,
  Calendar,
  Tag,
  TrendingUp
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from '@/components/ui/context-menu'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AdvancedDataTable, SortableHeader } from '@/components/advanced'
import { StatusAvatar } from '@/components/origin'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { formatCurrency } from '@/lib/utils'
import { log } from '@/lib/logger'

interface Contact {
  id: string
  username: string
  full_name?: string
  email?: string
  phone?: string
  instagram_id?: string
  customer_type?: string
  tags?: string[]
  notes?: string
  created_at: string
  last_contact_at?: string
  total_orders?: number
  total_spent?: number
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  useEffect(() => {
    fetchContacts()
  }, [])

  async function fetchContacts() {
    try {
      const { data: contactsData, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      const contactsWithStats = await Promise.all(
        (contactsData || []).map(async (contact: any) => {
          const { data: orders } = await supabase
            .from('orders')
            .select('total_amount')
            .eq('contact_id', contact.id)
            .in('status', ['paid', 'processing', 'shipped', 'delivered'])

          const totalOrders = orders?.length || 0
          const totalSpent = orders?.reduce((sum: number, order: any) => sum + Number(order.total_amount), 0) || 0

          return {
            ...contact,
            total_orders: totalOrders,
            total_spent: totalSpent,
          }
        })
      )

      setContacts(contactsWithStats)
    } catch (error) {
      console.error('Error fetching contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  const stats = {
    total: contacts.length,
    leads: contacts.filter((c) => c.customer_type === 'lead').length,
    customers: contacts.filter((c) => c.customer_type === 'customer').length,
    vip: contacts.filter((c) => c.customer_type === 'vip').length,
    totalRevenue: contacts.reduce((sum, c) => sum + (c.total_spent || 0), 0),
    avgSpent: contacts.length > 0 ? contacts.reduce((sum, c) => sum + (c.total_spent || 0), 0) / contacts.length : 0,
  }

  const conversionRate = stats.total > 0 ? (stats.customers + stats.vip) / stats.total * 100 : 0

  function getCustomerTypeBadge(type?: string) {
    const typeConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      lead: { label: 'Lead', variant: 'outline' },
      customer: { label: 'Client', variant: 'default' },
      vip: { label: 'VIP', variant: 'secondary' },
    }

    const config = typeConfig[type || ''] || { label: type || 'Prospect', variant: 'outline' as const }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  // Contact detail sheet component
  function ContactDetailSheet({ contact }: { contact: Contact }) {
    return (
      <SheetContent className="sm:max-w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Détails du contact</SheetTitle>
          <SheetDescription>@{contact.username}</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Informations générales</h4>
            <Card className="p-4 space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground">Nom d'utilisateur</Label>
                <p className="font-medium">@{contact.username}</p>
              </div>
              {contact.full_name && (
                <div>
                  <Label className="text-xs text-muted-foreground">Nom complet</Label>
                  <p className="font-medium">{contact.full_name}</p>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Label className="text-xs text-muted-foreground">Type:</Label>
                {getCustomerTypeBadge(contact.customer_type)}
              </div>
            </Card>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Coordonnées</h4>
            <Card className="p-4 space-y-3">
              {contact.email ? (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{contact.email}</span>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">Pas d'email</p>
              )}
              {contact.phone ? (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{contact.phone}</span>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">Pas de téléphone</p>
              )}
            </Card>
          </div>

          {/* Stats */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Statistiques</h4>
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-3">
                <p className="text-xs text-muted-foreground">Commandes</p>
                <p className="text-2xl font-bold">{contact.total_orders || 0}</p>
              </Card>
              <Card className="p-3">
                <p className="text-xs text-muted-foreground">Total dépensé</p>
                <p className="text-2xl font-bold">{formatCurrency(contact.total_spent || 0)}</p>
              </Card>
              <Card className="p-3">
                <p className="text-xs text-muted-foreground">Panier moyen</p>
                <p className="text-lg font-bold">
                  {contact.total_orders ? formatCurrency((contact.total_spent || 0) / contact.total_orders) : formatCurrency(0)}
                </p>
              </Card>
              <Card className="p-3">
                <p className="text-xs text-muted-foreground">Client depuis</p>
                <p className="text-sm font-medium">
                  {new Date(contact.created_at).toLocaleDateString('fr-FR')}
                </p>
              </Card>
            </div>
          </div>

          {/* Notes */}
          {contact.notes && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Notes</h4>
              <Card className="p-4">
                <p className="text-sm whitespace-pre-wrap">{contact.notes}</p>
              </Card>
            </div>
          )}

          {/* Tags */}
          {contact.tags && contact.tags.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {contact.tags.map((tag, idx) => (
                  <Badge key={idx} variant="outline">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3 pt-4">
            <h4 className="text-sm font-semibold">Actions</h4>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="default">
                <MessageSquare className="h-4 w-4 mr-2" />
                Voir les messages
              </Button>
              <Button size="sm" variant="outline">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Voir les commandes
              </Button>
              <Button size="sm" variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    )
  }

  // Define columns
  const columns: ColumnDef<Contact>[] = [
    {
      accessorKey: 'username',
      header: ({ column }) => <SortableHeader column={column}>Identifiant</SortableHeader>,
      cell: ({ row }) => {
        const contact = row.original
        // Déterminer le statut basé sur la dernière activité
        const getStatus = (): "online" | "offline" | "away" | "busy" => {
          if (!contact.last_contact_at) return "offline"
          const lastContact = new Date(contact.last_contact_at)
          const hoursSinceContact = (Date.now() - lastContact.getTime()) / (1000 * 60 * 60)
          if (hoursSinceContact < 1) return "online"
          if (hoursSinceContact < 24) return "away"
          return "offline"
        }
        
        return (
          <ContextMenu>
            <ContextMenuTrigger asChild>
              <Sheet>
                <SheetTrigger asChild>
                  <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                    <StatusAvatar
                      alt={contact.full_name || contact.username}
                      fallback={contact.username[0].toUpperCase()}
                      status={getStatus()}
                      size="sm"
                    />
                    <div>
                      <p className="font-medium">@{contact.username}</p>
                      {contact.full_name && (
                        <p className="text-xs text-muted-foreground">{contact.full_name}</p>
                      )}
                    </div>
                  </div>
                </SheetTrigger>
                <ContactDetailSheet contact={contact} />
              </Sheet>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem>
                <MessageSquare className="h-4 w-4 mr-2" />
                Voir les messages
              </ContextMenuItem>
              <ContextMenuItem>
                <ShoppingBag className="h-4 w-4 mr-2" />
                Voir les commandes
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem>
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </ContextMenuItem>
              <ContextMenuItem className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        )
      },
    },
    {
      accessorKey: 'full_name',
      header: 'Nom complet',
      cell: ({ row }) => (
        row.getValue('full_name') ? (
          <span>{row.getValue('full_name')}</span>
        ) : (
          <span className="text-muted-foreground italic">Non renseigné</span>
        )
      ),
    },
    {
      accessorKey: 'email',
      header: 'Contact',
      cell: ({ row }) => {
        const contact = row.original
        return (
          <Popover>
            <PopoverTrigger asChild>
              <button className="text-left hover:text-primary transition-colors">
                <div className="space-y-1">
                  {contact.email && (
                    <div className="flex items-center text-sm">
                      <Mail className="h-3 w-3 mr-1 text-muted-foreground" />
                      {contact.email}
                    </div>
                  )}
                  {contact.phone && (
                    <div className="flex items-center text-sm">
                      <Phone className="h-3 w-3 mr-1 text-muted-foreground" />
                      {contact.phone}
                    </div>
                  )}
                  {!contact.email && !contact.phone && (
                    <span className="text-muted-foreground italic text-sm">Pas de contact</span>
                  )}
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-60">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Actions rapides</h4>
                <Separator />
                <div className="space-y-1">
                  {contact.email && (
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <Mail className="h-4 w-4 mr-2" />
                      Envoyer un email
                    </Button>
                  )}
                  {contact.phone && (
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <Phone className="h-4 w-4 mr-2" />
                      Appeler
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Voir les messages
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )
      },
    },
    {
      accessorKey: 'customer_type',
      header: 'Type',
      cell: ({ row }) => getCustomerTypeBadge(row.getValue('customer_type')),
    },
    {
      accessorKey: 'total_orders',
      header: ({ column }) => <SortableHeader column={column}>Commandes</SortableHeader>,
      cell: ({ row }) => (
        <div className="flex items-center">
          <ShoppingBag className="h-4 w-4 mr-1 text-muted-foreground" />
          {row.getValue('total_orders') || 0}
        </div>
      ),
    },
    {
      accessorKey: 'total_spent',
      header: ({ column }) => <SortableHeader column={column}>Total dépensé</SortableHeader>,
      cell: ({ row }) => (
        <span className="font-semibold">
          {formatCurrency(row.getValue('total_spent') || 0)}
        </span>
      ),
    },
    {
      accessorKey: 'created_at',
      header: ({ column }) => <SortableHeader column={column}>Inscrit le</SortableHeader>,
      cell: ({ row }) => {
        const date = new Date(row.getValue('created_at'))
        return (
          <div className="text-sm text-muted-foreground">
            {date.toLocaleDateString('fr-FR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}
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
            <DropdownMenuItem>
              <MessageSquare className="h-4 w-4 mr-2" />
              Voir les messages
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ShoppingBag className="h-4 w-4 mr-2" />
              Voir les commandes
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Modifier le contact</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Supprimer le contact</DropdownMenuItem>
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

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Contacts</h1>
          <p className="text-muted-foreground">Gérez votre base de contacts CRM</p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Ajouter un contact
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 card-hover">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Total contacts</p>
              <p className="text-2xl font-bold">{stats.total}</p>
              <div className="mt-2 flex gap-2 text-xs text-muted-foreground">
                <span>{stats.leads} leads</span>
                <span>•</span>
                <span>{stats.customers} clients</span>
              </div>
            </div>
            <Users className="h-8 w-8 text-primary" />
          </div>
        </Card>

        <Card className="p-4 card-hover">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">VIP</p>
              <p className="text-2xl font-bold">{stats.vip}</p>
              <Badge variant="secondary" className="mt-2 text-xs">
                <Star className="h-3 w-3 mr-1" />
                Top clients
              </Badge>
            </div>
            <Star className="h-8 w-8 text-yellow-500" />
          </div>
        </Card>

        <Card className="p-4 card-hover">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">CA Total</p>
              <p className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Moy: {formatCurrency(stats.avgSpent)}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4 card-hover">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Taux de conversion</p>
              <p className="text-2xl font-bold">{conversionRate.toFixed(0)}%</p>
              <Progress value={conversionRate} className="mt-2 h-1.5" />
            </div>
            <ShoppingBag className="h-8 w-8 text-primary" />
          </div>
        </Card>
      </div>

      {/* Contacts Table */}
      <AdvancedDataTable
        columns={columns}
        data={contacts}
        searchKey="username"
        searchPlaceholder="Rechercher un contact (nom, email, téléphone)..."
        enableRowSelection={false}
        enableColumnVisibility={true}
        onExport={() => {
          log.info('Export contacts - fonctionnalité à implémenter')
          // TODO: Implement CSV export
        }}
      />
    </div>
  )
}
