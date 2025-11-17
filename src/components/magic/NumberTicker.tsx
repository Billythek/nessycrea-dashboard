"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface NumberTickerProps {
  value: number | string
  direction?: "up" | "down"
  delay?: number
  className?: string
  decimals?: number
  prefix?: string
  suffix?: string
  formatCurrency?: boolean
  currency?: string
}

export function NumberTicker({
  value,
  direction = "up",
  delay = 50,
  className,
  decimals = 0,
  prefix = "",
  suffix = "",
  formatCurrency: useCurrency = false,
  currency = "EUR",
}: NumberTickerProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const previousValueRef = useRef<number>(0)

  useEffect(() => {
    const numValue = typeof value === "string" ? parseFloat(value.replace(/[^0-9.-]/g, "")) : value

    if (isNaN(numValue)) {
      setDisplayValue(0)
      return
    }

    if (previousValueRef.current === numValue) {
      return
    }

    setIsAnimating(true)
    const startValue = previousValueRef.current
    const endValue = numValue
    const difference = Math.abs(endValue - startValue)
    const steps = Math.min(30, Math.max(10, Math.floor(difference / 10)))
    const increment = (endValue - startValue) / steps
    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++
      const nextValue = startValue + increment * currentStep

      if (currentStep >= steps) {
        setDisplayValue(endValue)
        setIsAnimating(false)
        previousValueRef.current = endValue
        clearInterval(timer)
      } else {
        setDisplayValue(Number(nextValue.toFixed(decimals)))
      }
    }, delay)

    return () => clearInterval(timer)
  }, [value, delay, decimals])

  const formatNumber = (num: number) => {
    if (useCurrency) {
      return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(num)
    }
    
    if (decimals > 0) {
      return num.toFixed(decimals).replace(".", ",")
    }
    return Math.floor(num).toLocaleString("fr-FR")
  }

  return (
    <span
      className={cn(
        "tabular-nums transition-all duration-300",
        isAnimating && "scale-105",
        className
      )}
    >
      {!useCurrency && prefix}
      {formatNumber(displayValue)}
      {!useCurrency && suffix}
    </span>
  )
}
