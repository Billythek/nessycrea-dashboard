"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { DASHBOARD_COLORS, getTrendColor } from "@/lib/colors"
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react"

type TimePeriod = "day" | "week" | "month" | "year"

interface RevenueDataPoint {
  label: string
  revenue: number
}

interface RevenueChartProps {
  data: {
    day: RevenueDataPoint[]
    week: RevenueDataPoint[]
    month: RevenueDataPoint[]
    year: RevenueDataPoint[]
  }
  trend?: number // Percentage change
}

const TIME_PERIODS = [
  { value: "day" as TimePeriod, label: "Jour" },
  { value: "week" as TimePeriod, label: "Semaine" },
  { value: "month" as TimePeriod, label: "Mois" },
  { value: "year" as TimePeriod, label: "Année" },
] as const

export default function RevenueChart({ data, trend }: RevenueChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("week")

  const currentData = data[selectedPeriod]

  // Calculate current total
  const currentTotal = currentData.reduce((sum, item) => sum + item.revenue, 0)

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="rounded-lg border px-3 py-2 shadow-lg"
          style={{
            backgroundColor: DASHBOARD_COLORS.chart.tooltipBg,
            borderColor: DASHBOARD_COLORS.chart.tooltipBorder,
          }}
        >
          <p className="text-xs text-muted-foreground mb-1">
            {payload[0].payload.label}
          </p>
          <p
            className="text-sm font-bold"
            style={{ color: DASHBOARD_COLORS.chart.revenuePrimary }}
          >
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-4">
      {/* Header with trend and time selector */}
      <div className="flex items-center justify-between">
        {/* Total and trend */}
        <div className="space-y-1">
          <div className="text-2xl font-bold tabular-nums text-foreground">
            {formatCurrency(currentTotal)}
          </div>
          {trend !== undefined && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-1.5"
            >
              {trend > 0 ? (
                <ArrowUpIcon
                  className="h-4 w-4"
                  style={{ color: DASHBOARD_COLORS.trend.up }}
                />
              ) : trend < 0 ? (
                <ArrowDownIcon
                  className="h-4 w-4"
                  style={{ color: DASHBOARD_COLORS.trend.down }}
                />
              ) : null}
              <span
                className="text-sm font-semibold tabular-nums"
                style={{ color: getTrendColor(trend) }}
              >
                {trend > 0 ? "+" : ""}
                {trend.toFixed(1)}%
              </span>
              <span className="text-xs text-muted-foreground">vs précédent</span>
            </motion.div>
          )}
        </div>

        {/* Time period selector */}
        <div className="flex gap-1 rounded-lg bg-card/50 p-1 border border-border/50">
          {TIME_PERIODS.map((period) => (
            <button
              key={period.value}
              onClick={() => setSelectedPeriod(period.value)}
              className={`
                relative px-3 py-1.5 text-xs font-medium rounded-md
                transition-all duration-200
                ${
                  selectedPeriod === period.value
                    ? "text-white"
                    : "text-muted-foreground hover:text-foreground"
                }
              `}
              style={{
                backgroundColor:
                  selectedPeriod === period.value
                    ? DASHBOARD_COLORS.timeSelector.activeBg
                    : "transparent",
              }}
            >
              {selectedPeriod === period.value && (
                <motion.div
                  layoutId="activeTimePeriod"
                  className="absolute inset-0 rounded-md border"
                  style={{
                    borderColor: DASHBOARD_COLORS.timeSelector.active,
                    backgroundColor: DASHBOARD_COLORS.timeSelector.activeBg,
                  }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{period.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedPeriod}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full"
          style={{ height: "300px" }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={currentData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={DASHBOARD_COLORS.chart.revenuePrimary}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={DASHBOARD_COLORS.chart.revenuePrimary}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke={DASHBOARD_COLORS.chart.gridLines}
                vertical={false}
              />

              <XAxis
                dataKey="label"
                stroke={DASHBOARD_COLORS.chart.axisText}
                tick={{ fill: DASHBOARD_COLORS.chart.axisText, fontSize: 12 }}
                axisLine={{ stroke: DASHBOARD_COLORS.chart.gridLines }}
                tickLine={false}
              />

              <YAxis
                stroke={DASHBOARD_COLORS.chart.axisText}
                tick={{ fill: DASHBOARD_COLORS.chart.axisText, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => {
                  if (value >= 1000) {
                    return `${(value / 1000).toFixed(0)}k€`
                  }
                  return `${value}€`
                }}
              />

              <Tooltip content={<CustomTooltip />} />

              <Area
                type="monotone"
                dataKey="revenue"
                stroke={DASHBOARD_COLORS.chart.revenuePrimary}
                strokeWidth={2}
                fill="url(#revenueGradient)"
                animationDuration={800}
                animationBegin={0}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
