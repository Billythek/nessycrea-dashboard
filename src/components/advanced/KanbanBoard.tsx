"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatRelativeTime } from "@/lib/utils"
import {
  Package,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  MoreVertical,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type KanbanStatus = "draft" | "paid" | "processing" | "shipped" | "delivered" | "cancelled"

interface KanbanItem {
  id: string
  title: string
  description?: string
  status: KanbanStatus
  metadata?: Record<string, unknown>
}

interface KanbanColumn {
  id: KanbanStatus
  title: string
  icon: React.ReactNode
  color: string
  items: KanbanItem[]
}

interface KanbanBoardProps {
  items: KanbanItem[]
  onStatusChange?: (itemId: string, newStatus: KanbanStatus) => void
  onItemClick?: (item: KanbanItem) => void
  renderItem?: (item: KanbanItem) => React.ReactNode
  className?: string
}

const statusConfig: Record<KanbanStatus, { title: string; icon: React.ReactNode; color: string }> = {
  draft: {
    title: "Brouillon",
    icon: <Clock className="h-4 w-4" />,
    color: "bg-gray-500",
  },
  paid: {
    title: "Pay?",
    icon: <CheckCircle2 className="h-4 w-4" />,
    color: "bg-blue-500",
  },
  processing: {
    title: "En traitement",
    icon: <Package className="h-4 w-4" />,
    color: "bg-yellow-500",
  },
  shipped: {
    title: "Exp?di?",
    icon: <Truck className="h-4 w-4" />,
    color: "bg-purple-500",
  },
  delivered: {
    title: "Livr?",
    icon: <CheckCircle2 className="h-4 w-4" />,
    color: "bg-green-500",
  },
  cancelled: {
    title: "Annul?",
    icon: <XCircle className="h-4 w-4" />,
    color: "bg-red-500",
  },
}

function KanbanCard({ item, onStatusChange, onItemClick, renderItem }: {
  item: KanbanItem
  onStatusChange?: (itemId: string, newStatus: KanbanStatus) => void
  onItemClick?: (item: KanbanItem) => void
  renderItem?: (item: KanbanItem) => React.ReactNode
}) {
  const status = statusConfig[item.status]

  if (renderItem) {
    return <div onClick={() => onItemClick?.(item)}>{renderItem(item)}</div>
  }

  return (
    <Card
      className="p-4 mb-3 cursor-pointer hover:shadow-md transition-all hover:scale-[1.02] bg-card border border-white/10"
      onClick={() => onItemClick?.(item)}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
          {item.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
          )}
        </div>
        {onStatusChange && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {Object.entries(statusConfig).map(([statusId, config]) => (
                <DropdownMenuItem
                  key={statusId}
                  onClick={(e) => {
                    e.stopPropagation()
                    onStatusChange(item.id, statusId as KanbanStatus)
                  }}
                  disabled={item.status === statusId}
                >
                  {config.icon}
                  <span className="ml-2">{config.title}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Metadata display */}
      {item.metadata && (
        <div className="mt-2 space-y-1">
          {(() => {
            const amount = item.metadata?.amount
            return amount && typeof amount === 'number' ? (
              <Badge variant="outline" className="text-xs">
                {formatCurrency(amount)}
              </Badge>
            ) : null
          })()}
          {(() => {
            const date = item.metadata?.date
            return date && typeof date === 'string' ? (
              <p className="text-xs text-muted-foreground">
                {formatRelativeTime(date)}
              </p>
            ) : null
          })()}
        </div>
      )}
    </Card>
  )
}

export function KanbanBoard({
  items,
  onStatusChange,
  onItemClick,
  renderItem,
  className,
}: KanbanBoardProps) {
  const columns: KanbanColumn[] = React.useMemo(() => {
    const cols: KanbanColumn[] = Object.entries(statusConfig).map(([id, config]) => ({
      id: id as KanbanStatus,
      title: config.title,
      icon: config.icon,
      color: config.color,
      items: items.filter((item) => item.status === id),
    }))
    return cols
  }, [items])

  return (
    <div className={cn("flex gap-4 overflow-x-auto pb-4", className)}>
      {columns.map((column) => (
        <div
          key={column.id}
          className="flex-shrink-0 w-64 sm:w-72 md:w-80 lg:w-72 bg-muted/30 rounded-lg p-3 sm:p-4 min-h-[400px] sm:min-h-[500px]"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className={cn("rounded-full p-1.5", column.color)}>
              {column.icon}
            </div>
            <h3 className="font-semibold text-sm">{column.title}</h3>
            <Badge variant="secondary" className="ml-auto">
              {column.items.length}
            </Badge>
          </div>

          <div className="space-y-2">
            {column.items.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                Aucun ?l?ment
              </div>
            ) : (
              column.items.map((item) => (
                <div key={item.id} className="group">
                  <KanbanCard
                    item={item}
                    onStatusChange={onStatusChange}
                    onItemClick={onItemClick}
                    renderItem={renderItem}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
