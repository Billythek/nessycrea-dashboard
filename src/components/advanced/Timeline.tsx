"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { CheckCircle2, Circle, Clock, AlertCircle, XCircle } from "lucide-react"

export interface TimelineItem {
  id: string
  title: string
  description?: string
  timestamp: Date
  status?: "completed" | "in-progress" | "pending" | "error" | "cancelled"
  icon?: React.ReactNode
  metadata?: Record<string, unknown>
}

interface TimelineProps {
  items: TimelineItem[]
  className?: string
  variant?: "default" | "compact"
}

const statusIcons = {
  completed: <CheckCircle2 className="h-5 w-5 text-green-500" />,
  "in-progress": <Clock className="h-5 w-5 text-blue-500 animate-pulse" />,
  pending: <Circle className="h-5 w-5 text-muted-foreground" />,
  error: <AlertCircle className="h-5 w-5 text-destructive" />,
  cancelled: <XCircle className="h-5 w-5 text-muted-foreground" />,
}

const statusColors = {
  completed: "border-green-500 bg-green-500/10",
  "in-progress": "border-blue-500 bg-blue-500/10",
  pending: "border-muted bg-muted/10",
  error: "border-destructive bg-destructive/10",
  cancelled: "border-muted bg-muted/10",
}

export function Timeline({ items, className, variant = "default" }: TimelineProps) {
  // Helper to safely format date
  const formatDate = (timestamp: Date, formatStr: string) => {
    try {
      const date = timestamp instanceof Date ? timestamp : new Date(timestamp)
      return isNaN(date.getTime()) ? 'Date invalide' : format(date, formatStr, { locale: fr })
    } catch {
      return 'Date invalide'
    }
  }

  return (
    <div className={cn("relative space-y-4", className)}>
      {items.map((item, index) => (
        <div key={item.id} className="relative flex gap-4">
          {/* Timeline line */}
          {index !== items.length - 1 && (
            <div className="absolute left-6 top-10 h-[calc(100%+1rem)] w-px bg-border" />
          )}

          {/* Icon */}
          <div
            className={cn(
              "relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 transition-all",
              item.status ? statusColors[item.status] : statusColors.pending
            )}
          >
            {item.icon || (item.status && statusIcons[item.status]) || statusIcons.pending}
          </div>

          {/* Content */}
          {variant === "compact" ? (
            <div className="flex-1 space-y-1 pb-4">
              <div className="flex items-center justify-between gap-4">
                <h4 className="font-medium leading-none">{item.title}</h4>
                <time className="text-xs text-muted-foreground">
                  {formatDate(item.timestamp, "HH:mm")}
                </time>
              </div>
              {item.description && (
                <p className="text-sm text-muted-foreground">{item.description}</p>
              )}
            </div>
          ) : (
            <Card className="flex-1 p-4 card-hover">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{item.title}</h4>
                    {item.status && (
                      <Badge variant={item.status === "completed" ? "default" : "secondary"} className="text-xs">
                        {item.status === "completed" && "Terminé"}
                        {item.status === "in-progress" && "En cours"}
                        {item.status === "pending" && "En attente"}
                        {item.status === "error" && "Erreur"}
                        {item.status === "cancelled" && "Annulé"}
                      </Badge>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  )}
                  {item.metadata && Object.keys(item.metadata).length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {Object.entries(item.metadata).map(([key, value]) => (
                        <div key={key} className="text-xs">
                          <span className="text-muted-foreground">{key}:</span>{" "}
                          <span className="font-medium">
                            {typeof value === 'string' || typeof value === 'number' 
                              ? String(value) 
                              : JSON.stringify(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <time className="text-sm text-muted-foreground whitespace-nowrap">
                  {formatDate(item.timestamp, "dd MMM yyyy 'à' HH:mm")}
                </time>
              </div>
            </Card>
          )}
        </div>
      ))}
    </div>
  )
}

// Helper component for creating timeline items from activities
export function ActivityTimeline({ activities }: { activities: Array<{ id: string; message_text: string | null; direction: string; status: string; received_at: string; contacts: { username: string } | null }> }) {
  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucune activité récente
      </div>
    )
  }

  const timelineItems: TimelineItem[] = activities.map((activity) => {
    const act = activity as Record<string, unknown>
    const timestampStr = (act.created_at as string | undefined) 
      || (act.timestamp as string | undefined) 
      || activity.received_at
    const timestamp = timestampStr ? new Date(timestampStr) : new Date()
    const title = (act.title as string | undefined) 
      || (act.type as string | undefined) 
      || 'Activité'
    const description = (act.description as string | undefined) 
      || (act.details as string | undefined) 
      || activity.message_text
    return {
      id: activity.id || Math.random().toString(),
      title: title || 'Activité',
      description: description || undefined,
      timestamp,
      status: activity.status === 'unread' ? 'pending' : (activity.status === 'error' ? 'error' : 'completed'),
      metadata: act.metadata as Record<string, unknown> | undefined,
    }
  })

  return <Timeline items={timelineItems} variant="compact" />
}
