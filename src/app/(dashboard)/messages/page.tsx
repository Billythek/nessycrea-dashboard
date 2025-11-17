'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { ColumnDef } from '@tanstack/react-table'
import {
  MessageSquare,
  Circle,
  CheckCircle2,
  Send,
  Inbox,
  MoreHorizontal,
  ExternalLink,
  User,
  Calendar,
  TrendingUp
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AdvancedDataTable, SortableHeader } from '@/components/advanced'
import { Separator } from '@/components/ui/separator'
import { log } from '@/lib/logger'
import { transformMessage, handleSupabaseError } from '@/lib/supabase-helpers'
import type { SupabaseMessage } from '@/lib/types'
import type { Message } from '@/lib/supabase'

interface MessageWithContact extends Message {
  contacts: {
    username: string
    full_name?: string | null
  } | null
  sentiment?: string
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<MessageWithContact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error: supabaseError } = await supabase
        .from('messages')
        .select(`
          id,
          message_text,
          direction,
          status,
          received_at,
          sentiment_label,
          requires_response,
          contacts (
            username,
            full_name
          )
        `)
        .order('received_at', { ascending: false })
        .limit(100)

      if (supabaseError) {
        const errorMessage = handleSupabaseError(supabaseError, 'le chargement des messages')
        setError(errorMessage)
        setMessages([])
        return
      }

      const transformedData = (data || []).map((msg) => 
        transformMessage(msg as unknown as SupabaseMessage)
      )

      setMessages(transformedData)
      log.info(`Messages chargés: ${transformedData.length}`)
    } catch (err) {
      log.error('Erreur lors du chargement des messages', err)
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      setMessages([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  const updateMessageStatus = useCallback(async (messageId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ status: newStatus })
        .eq('id', messageId)

      if (error) {
        throw error
      }

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId ? { ...msg, status: newStatus as Message['status'] } : msg
        )
      )
      log.info(`Statut du message ${messageId} mis à jour: ${newStatus}`)
    } catch (error) {
      log.error('Erreur lors de la mise à jour du statut du message', error)
    }
  }, [])

  // Calcul sécurisé des statistiques
  const statusCounts = {
    all: messages?.length || 0,
    unread: messages?.filter((m) => m.status === 'unread').length || 0,
    read: messages?.filter((m) => m.status === 'read').length || 0,
    responded: messages?.filter((m) => m.status === 'responded').length || 0,
  }

  // Calculate response rate
  const responseRate = statusCounts.all > 0
    ? (statusCounts.responded / statusCounts.all) * 100
    : 0

  // Define columns for AdvancedDataTable - useMemo pour éviter les recréations
  const columns: ColumnDef<MessageWithContact>[] = useMemo(() => [
    {
      accessorKey: 'contacts',
      header: ({ column }) => <SortableHeader column={column}>Contact</SortableHeader>,
      cell: ({ row }) => {
        const contact = row.original.contacts
        return (
          <HoverCard>
            <HoverCardTrigger asChild>
              <div className="cursor-pointer">
                <p className="font-semibold">@{contact?.username}</p>
                {contact?.full_name && (
                  <p className="text-xs text-muted-foreground">
                    {contact.full_name}
                  </p>
                )}
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <h4 className="text-sm font-semibold">Informations du contact</h4>
                </div>
                <Separator />
                <div className="space-y-1 text-sm">
                  <p><span className="text-muted-foreground">Nom d'utilisateur:</span> @{contact?.username}</p>
                  <p><span className="text-muted-foreground">Nom complet:</span> {contact?.full_name || 'N/A'}</p>
                  <p><span className="text-muted-foreground">Dernière activité:</span> {new Date(row.original.received_at).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        )
      },
    },
    {
      accessorKey: 'message_text',
      header: 'Message',
      cell: ({ row }) => (
        <Sheet>
          <SheetTrigger asChild>
            <button className="text-left hover:underline max-w-[400px] truncate block">
              {row.getValue('message_text')}
            </button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-[540px]">
            <SheetHeader>
              <SheetTitle>Détails du message</SheetTitle>
              <SheetDescription>
                Message de @{row.original.contacts?.username}
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-4">
              {/* Contact Info */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Contact
                </h4>
                <Card className="p-3">
                  <p className="font-semibold">@{row.original.contacts?.username}</p>
                  {row.original.contacts?.full_name && (
                    <p className="text-sm text-muted-foreground">{row.original.contacts.full_name}</p>
                  )}
                </Card>
              </div>

              {/* Message Content */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Contenu du message
                </h4>
                <Card className="p-4">
                  <p className="text-sm whitespace-pre-wrap">{row.original.message_text}</p>
                </Card>
              </div>

              {/* Metadata */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Métadonnées</h4>
                <div className="grid grid-cols-2 gap-3">
                  <Card className="p-3">
                    <p className="text-xs text-muted-foreground">Direction</p>
                    <Badge variant={row.original.direction === 'inbound' ? 'default' : 'secondary'} className="mt-1">
                      {row.original.direction === 'inbound' ? 'Reçu' : 'Envoyé'}
                    </Badge>
                  </Card>
                  <Card className="p-3">
                    <p className="text-xs text-muted-foreground">Statut</p>
                    <Badge
                      variant={
                        row.original.status === 'unread' ? 'destructive' :
                        row.original.status === 'responded' ? 'default' : 'secondary'
                      }
                      className="mt-1"
                    >
                      {row.original.status === 'unread' ? 'Non lu' :
                       row.original.status === 'read' ? 'Lu' : 'Répondu'}
                    </Badge>
                  </Card>
                  {row.original.sentiment && (
                    <Card className="p-3">
                      <p className="text-xs text-muted-foreground">Sentiment</p>
                      <Badge
                        variant="outline"
                        className={`mt-1 ${
                          row.original.sentiment === 'positive' ? 'text-green-600 border-green-600' :
                          row.original.sentiment === 'negative' ? 'text-red-600 border-red-600' :
                          'text-gray-600 border-gray-600'
                        }`}
                      >
                        {row.original.sentiment === 'positive' ? 'Positif' :
                         row.original.sentiment === 'negative' ? 'Négatif' : 'Neutre'}
                      </Badge>
                    </Card>
                  )}
                  <Card className="p-3">
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="text-sm font-medium mt-1">
                      {new Date(row.original.received_at).toLocaleString('fr-FR')}
                    </p>
                  </Card>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-4">
                <h4 className="text-sm font-semibold">Actions</h4>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateMessageStatus(row.original.id, 'read')}
                  >
                    Marquer comme lu
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateMessageStatus(row.original.id, 'responded')}
                  >
                    Marquer comme répondu
                  </Button>
                  <Button size="sm" variant="default">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Ouvrir dans Instagram
                  </Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      ),
    },
    {
      accessorKey: 'direction',
      header: 'Direction',
      cell: ({ row }) => (
        <Badge variant={row.getValue('direction') === 'inbound' ? 'default' : 'secondary'}>
          {row.getValue('direction') === 'inbound' ? (
            <>
              <Inbox className="h-3 w-3 mr-1" />
              Reçu
            </>
          ) : (
            <>
              <Send className="h-3 w-3 mr-1" />
              Envoyé
            </>
          )}
        </Badge>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Statut',
      cell: ({ row }) => {
        const status = row.getValue('status') as string
        return (
          <Badge
            variant={
              status === 'unread' ? 'destructive' :
              status === 'responded' ? 'default' : 'secondary'
            }
          >
            {status === 'unread' ? 'Non lu' :
             status === 'read' ? 'Lu' : 'Répondu'}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'sentiment',
      header: 'Sentiment',
      cell: ({ row }) => {
        const sentiment = row.getValue('sentiment') as string | undefined
        if (!sentiment) return <span className="text-muted-foreground text-sm">-</span>

        return (
          <Badge
            variant="outline"
            className={
              sentiment === 'positive' ? 'text-green-600 border-green-600' :
              sentiment === 'negative' ? 'text-red-600 border-red-600' :
              'text-gray-600 border-gray-600'
            }
          >
            {sentiment === 'positive' ? 'Positif' :
             sentiment === 'negative' ? 'Négatif' : 'Neutre'}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'received_at',
      header: ({ column }) => <SortableHeader column={column}>Date</SortableHeader>,
      cell: ({ row }) => {
        const date = new Date(row.getValue('received_at'))
        return (
          <div className="text-sm text-muted-foreground">
            {date.toLocaleDateString('fr-FR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}
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
            <DropdownMenuItem onClick={() => updateMessageStatus(row.original.id, 'read')}>
              Marquer comme lu
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateMessageStatus(row.original.id, 'unread')}>
              Marquer comme non lu
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateMessageStatus(row.original.id, 'responded')}>
              Marquer comme répondu
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Voir la conversation</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], [updateMessageStatus])

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
          <h1 className="text-3xl font-bold text-foreground">Messages</h1>
          <p className="text-muted-foreground">Gérez vos conversations Instagram</p>
        </div>
        <Card className="p-8 bg-card border border-destructive/20">
          <div className="flex flex-col items-center justify-center space-y-4">
            <MessageSquare className="h-12 w-12 text-destructive" />
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">Erreur de chargement</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={fetchMessages} variant="outline">
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
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Messages</h1>
        <p className="text-muted-foreground">Gérez vos conversations Instagram</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 card-hover">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{statusCounts.all}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-primary" />
          </div>
        </Card>

        <Card className="p-4 card-hover">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Non lus</p>
              <p className="text-2xl font-bold">{statusCounts.unread}</p>
              {statusCounts.unread > 0 && (
                <Badge variant="destructive" className="mt-2 text-xs">
                  Nécessite attention
                </Badge>
              )}
            </div>
            <Circle className="h-8 w-8 text-orange-500" />
          </div>
        </Card>

        <Card className="p-4 card-hover">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Répondus</p>
              <p className="text-2xl font-bold">{statusCounts.responded}</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4 card-hover">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Taux de réponse</p>
              <p className="text-2xl font-bold">{responseRate.toFixed(0)}%</p>
              <Progress value={responseRate} className="mt-2 h-1.5" />
            </div>
            <TrendingUp className="h-8 w-8 text-primary" />
          </div>
        </Card>
      </div>

      {/* Messages Table */}
      <AdvancedDataTable
        columns={columns}
        data={messages}
        searchKey="message_text"
        searchPlaceholder="Rechercher un message ou un contact..."
        enableRowSelection={false}
        enableColumnVisibility={true}
        onExport={() => {
          log.info('Export messages - fonctionnalité à implémenter')
          // TODO: Implement CSV export
        }}
      />
    </div>
  )
}
