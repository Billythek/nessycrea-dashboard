"use client"

import { motion } from "framer-motion"
import { DASHBOARD_COLORS } from "@/lib/colors"

interface OrderStatusData {
  status: string
  count: number
  percentage: number
}

interface OrderStatusChartProps {
  data: OrderStatusData[]
}

const STATUS_CONFIG = {
  'Livrée': { color: DASHBOARD_COLORS.status.delivered, label: 'Livrée' },
  'Expédiée': { color: DASHBOARD_COLORS.status.shipped, label: 'Expédiée' },
  'En cours': { color: DASHBOARD_COLORS.status.processing, label: 'En cours' },
  'En attente': { color: DASHBOARD_COLORS.status.pending, label: 'En attente' },
  'Annulée': { color: DASHBOARD_COLORS.status.cancelled, label: 'Annulée' },
  'Échouée': { color: DASHBOARD_COLORS.status.failed, label: 'Échouée' },
} as const

export default function OrderStatusChart({ data }: OrderStatusChartProps) {
  // Sort data by count (highest first)
  const sortedData = [...data].sort((a, b) => b.count - a.count)

  // Calculate total for percentage
  const total = sortedData.reduce((sum, item) => sum + item.count, 0)

  return (
    <div className="space-y-4">
      {sortedData.map((item, index) => {
        const config = STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG]
        if (!config) return null

        const percentage = total > 0 ? (item.count / total) * 100 : 0

        return (
          <motion.div
            key={item.status}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              ease: "easeOut",
            }}
            className="space-y-2"
          >
            {/* Label and count */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: config.color }}
                />
                <span className="font-medium text-foreground">
                  {config.label}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground">
                  {item.count} commande{item.count > 1 ? 's' : ''}
                </span>
                <span
                  className="font-semibold tabular-nums"
                  style={{ color: config.color }}
                >
                  {percentage.toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="relative h-8 overflow-hidden rounded-lg bg-card/50 border border-border/50">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.1 + 0.2,
                  ease: [0.4, 0, 0.2, 1],
                }}
                className="absolute inset-y-0 left-0 rounded-lg"
                style={{
                  backgroundColor: config.color,
                  opacity: 0.15,
                }}
              />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.1 + 0.2,
                  ease: [0.4, 0, 0.2, 1],
                }}
                className="absolute inset-y-0 left-0 rounded-lg border-r-2"
                style={{
                  backgroundColor: `${config.color}20`,
                  borderRightColor: config.color,
                }}
              >
                {/* Inner glow effect */}
                <div
                  className="absolute inset-0 rounded-lg opacity-50"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${config.color}30)`,
                  }}
                />
              </motion.div>

              {/* Count label inside bar (only if bar is wide enough) */}
              {percentage > 15 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.1 + 0.6,
                  }}
                  className="absolute inset-0 flex items-center px-3"
                >
                  <span
                    className="text-xs font-bold tabular-nums"
                    style={{ color: config.color }}
                  >
                    {item.count}
                  </span>
                </motion.div>
              )}
            </div>
          </motion.div>
        )
      })}

      {/* Total summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: sortedData.length * 0.1 + 0.3 }}
        className="flex items-center justify-between border-t border-border/50 pt-4 mt-6"
      >
        <span className="text-sm font-medium text-muted-foreground">
          Total des commandes
        </span>
        <span className="text-lg font-bold text-foreground tabular-nums">
          {total}
        </span>
      </motion.div>
    </div>
  )
}
