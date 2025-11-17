"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import NumberTicker from "@/components/magic/number-ticker"
import { cn } from "@/lib/utils"

interface AnimatedKPICardProps {
  title: string
  value: number
  change?: number
  trend?: "up" | "down" | "neutral"
  prefix?: string
  suffix?: string
  delay?: number
  decimalPlaces?: number
  icon?: React.ReactNode
  description?: string
  sparklineData?: number[]
}

export default function AnimatedKPICard({
  title,
  value,
  change,
  trend = "neutral",
  prefix = "",
  suffix = "",
  delay = 0,
  decimalPlaces = 0,
  icon,
  description,
  sparklineData,
}: AnimatedKPICardProps) {
  const getTrendColor = () => {
    if (trend === "up") return "text-green-600 dark:text-green-400"
    if (trend === "down") return "text-red-600 dark:text-red-400"
    return "text-muted-foreground"
  }

  const getTrendIcon = () => {
    if (trend === "up") return <TrendingUp className="h-4 w-4" />
    if (trend === "down") return <TrendingDown className="h-4 w-4" />
    return <Activity className="h-4 w-4" />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {icon && (
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              {icon}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold tracking-tight">
                {prefix}
                <NumberTicker
                  value={value}
                  delay={delay * 0.1 + 0.2}
                  decimalPlaces={decimalPlaces}
                  className="text-3xl font-bold"
                />
                {suffix}
              </span>
            </div>

            {change !== undefined && (
              <div className={cn("flex items-center space-x-1 text-xs", getTrendColor())}>
                {getTrendIcon()}
                <span className="font-medium">
                  {change > 0 ? "+" : ""}{change}%
                </span>
                <span className="text-muted-foreground">vs. mois dernier</span>
              </div>
            )}

            {description && (
              <p className="text-xs text-muted-foreground pt-1">
                {description}
              </p>
            )}

            {sparklineData && sparklineData.length > 0 && (
              <div className="mt-4 h-16">
                <MiniSparkline data={sparklineData} color={getTrendColor()} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Mini sparkline component
function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100
    const y = 100 - ((value - min) / range) * 100
    return `${x},${y}`
  }).join(" ")

  return (
    <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <motion.polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        points={points}
        className={color}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
      />
    </svg>
  )
}
