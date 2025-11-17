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

  // Contact detail sheet component - Compact & Interactive
  function ContactDetailSheet({ contact }: { contact: Contact }) {
    const [activeTab, setActiveTab] = useState<'info' | 'stats' | 'history'>('info')
    const [copiedField, setCopiedField] = useState<string | null>(null)

    const avgOrderValue = contact.total_orders ? (contact.total_spent || 0) / contact.total_orders : 0
    const daysSinceFirstContact = Math.floor((Date.now() - new Date(contact.created_at).getTime()) / (1000 * 60 * 60 * 24))
    const loyaltyScore = Math.min(100, ((contact.total_orders || 0) * 15) + (daysSinceFirstContact / 10))

    const copyToClipboard = (text: string, field: string) => {
      navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 1500)
    }

    const getTypeColor = (type?: string) => {
      switch (type) {
        case 'vip': return 'from-amber-500 to-orange-500'
        case 'customer': return 'from-emerald-500 to-green-500'
        default: return 'from-gray-400 to-gray-500'
      }
    }

    return (
      <SheetContent className="sm:max-w-[420px] p-0 overflow-hidden">
        {/* Header avec gradient */}
        <div className={`relative h-32 bg-gradient-to-br ${getTypeColor(contact.customer_type)} p-4`}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white text-xl font-bold">
                  {contact.username[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">@{contact.username}</h3>
                  {contact.full_name && (
                    <p className="text-white/80 text-sm">{contact.full_name}</p>
                  )}
                </div>
              </div>
              {contact.customer_type === 'vip' && (
                <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                  <Star className="h-4 w-4 text-yellow-300 fill-yellow-300" />
                </div>
              )}
            </div>
          </div>

          {/* Score de fidélité */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center justify-between text-white/80 text-xs mb-1">
              <span>Fidélité</span>
              <span>{loyaltyScore.toFixed(0)}%</span>
            </div>
            <div className="h-1.5 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-1000"
                style={{ width: `${loyaltyScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Navigation tabs */}
        <div className="flex border-b border-border">
          {[
            { id: 'info', label: 'Infos', icon: Users },
            { id: 'stats', label: 'Stats', icon: TrendingUp },
            { id: 'history', label: 'Historique', icon: Calendar }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary -mb-[1px]'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 h-[calc(100vh-200px)] overflow-y-auto">
          {activeTab === 'info' && (
            <>
              {/* Coordonnées cliquables */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contact</p>

                {contact.email && (
                  <button
                    onClick={() => copyToClipboard(contact.email!, 'email')}
                    className="w-full flex items-center gap-3 p-3 bg-muted/50 rounded-xl hover:bg-muted transition-colors group"
                  >
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm font-medium truncate">{contact.email}</p>
                    </div>
                    <span className="text-xs text-muted-foreground group-hover:text-primary">
                      {copiedField === 'email' ? '✓ Copié' : 'Cliquer pour copier'}
                    </span>
                  </button>
                )}

                {contact.phone && (
                  <button
                    onClick={() => copyToClipboard(contact.phone!, 'phone')}
                    className="w-full flex items-center gap-3 p-3 bg-muted/50 rounded-xl hover:bg-muted transition-colors group"
                  >
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <Phone className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-xs text-muted-foreground">Téléphone</p>
                      <p className="text-sm font-medium">{contact.phone}</p>
                    </div>
                    <span className="text-xs text-muted-foreground group-hover:text-primary">
                      {copiedField === 'phone' ? '✓ Copié' : 'Cliquer pour copier'}
                    </span>
                  </button>
                )}

                {contact.instagram_id && (
                  <button
                    onClick={() => window.open(`https://instagram.com/${contact.username}`, '_blank')}
                    className="w-full flex items-center gap-3 p-3 bg-muted/50 rounded-xl hover:bg-muted transition-colors group"
                  >
                    <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                      <ExternalLink className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-xs text-muted-foreground">Instagram</p>
                      <p className="text-sm font-medium">@{contact.username}</p>
                    </div>
                    <span className="text-xs text-muted-foreground group-hover:text-primary">
                      Ouvrir le profil
                    </span>
                  </button>
                )}
              </div>

              {/* Tags interactifs */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {contact.customer_type && (
                    <Badge
                      className={`cursor-pointer transition-transform hover:scale-105 ${
                        contact.customer_type === 'vip'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                          : contact.customer_type === 'customer'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                      }`}
                    >
                      {contact.customer_type === 'vip' ? '⭐ VIP' : contact.customer_type === 'customer' ? '✓ Client' : '👋 Lead'}
                    </Badge>
                  )}
                  {contact.tags?.map((tag, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="cursor-pointer transition-transform hover:scale-105"
                    >
                      {tag}
                    </Badge>
                  ))}
                  <Badge
                    variant="outline"
                    className="cursor-pointer border-dashed hover:border-solid transition-all"
                  >
                    + Ajouter
                  </Badge>
                </div>
              </div>

              {/* Notes avec édition inline */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Notes</p>
                  <button className="text-xs text-primary hover:underline">Modifier</button>
                </div>
                <div className="p-3 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-900/30">
                  <p className="text-sm">
                    {contact.notes || 'Aucune note. Cliquez sur "Modifier" pour ajouter des informations importantes.'}
                  </p>
                </div>
              </div>
            </>
          )}

          {activeTab === 'stats' && (
            <>
              {/* Mini dashboard avec métriques */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <ShoppingBag className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-medium text-blue-600">Commandes</span>
                  </div>
                  <p className="text-3xl font-bold">{contact.total_orders || 0}</p>
                </div>

                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-xs font-medium text-green-600">Dépensé</span>
                  </div>
                  <p className="text-2xl font-bold">{formatCurrency(contact.total_spent || 0)}</p>
                </div>

                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-purple-600" />
                    <span className="text-xs font-medium text-purple-600">Panier moyen</span>
                  </div>
                  <p className="text-2xl font-bold">{formatCurrency(avgOrderValue)}</p>
                </div>

                <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-orange-600" />
                    <span className="text-xs font-medium text-orange-600">Ancienneté</span>
                  </div>
                  <p className="text-2xl font-bold">{daysSinceFirstContact}j</p>
                </div>
              </div>

              {/* Graphique de progression */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Performance</p>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Fréquence d'achat</span>
                      <span className="font-medium">
                        {contact.total_orders ? (daysSinceFirstContact / contact.total_orders).toFixed(0) : 0} jours/commande
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min(100, (contact.total_orders || 0) * 25)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Valeur client</span>
                      <span className="font-medium">{formatCurrency(contact.total_spent || 0)}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min(100, ((contact.total_spent || 0) / 200) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Potentiel VIP</span>
                      <span className="font-medium">{loyaltyScore.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-1000"
                        style={{ width: `${loyaltyScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'history' && (
            <>
              {/* Timeline d'activité */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Activité récente</p>

                <div className="space-y-0">
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        <ShoppingBag className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="w-0.5 h-full bg-border" />
                    </div>
                    <div className="pb-4">
                      <p className="text-sm font-medium">Dernière commande</p>
                      <p className="text-xs text-muted-foreground">Il y a 3 jours • {formatCurrency(17.40)}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <MessageSquare className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="w-0.5 h-full bg-border" />
                    </div>
                    <div className="pb-4">
                      <p className="text-sm font-medium">Message reçu</p>
                      <p className="text-xs text-muted-foreground">Il y a 5 jours • "Merci pour la livraison rapide !"</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                        <Star className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="w-0.5 h-full bg-border" />
                    </div>
                    <div className="pb-4">
                      <p className="text-sm font-medium">Avis laissé</p>
                      <p className="text-xs text-muted-foreground">Il y a 1 semaine • ⭐⭐⭐⭐⭐</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                        <UserPlus className="h-4 w-4 text-amber-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Premier contact</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(contact.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Actions rapides - Footer fixe */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-card border-t border-border">
          <div className="grid grid-cols-3 gap-2">
            <button className="flex flex-col items-center gap-1 p-3 bg-primary/10 rounded-xl hover:bg-primary/20 transition-colors active:scale-95">
              <MessageSquare className="h-5 w-5 text-primary" />
              <span className="text-xs font-medium">Messages</span>
            </button>
            <button className="flex flex-col items-center gap-1 p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors active:scale-95">
              <ShoppingBag className="h-5 w-5 text-emerald-600" />
              <span className="text-xs font-medium">Commandes</span>
            </button>
            <button className="flex flex-col items-center gap-1 p-3 bg-muted rounded-xl hover:bg-muted/80 transition-colors active:scale-95">
              <Edit className="h-5 w-5" />
              <span className="text-xs font-medium">Modifier</span>
            </button>
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
