"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

interface EnhancedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  glow?: boolean
  gradient?: boolean
  border?: "default" | "subtle" | "none"
}

export function EnhancedCard({
  className,
  hover = true,
  glow = false,
  gradient = false,
  border = "default",
  children,
  ...props
}: EnhancedCardProps) {
  const borderClasses = {
    default: "border border-white/10",
    subtle: "border border-white/5",
    none: "border-0",
  }

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-300",
        hover && "hover:shadow-lg hover:scale-[1.02] cursor-pointer",
        glow && "hover:shadow-primary/20",
        gradient && "bg-gradient-to-br from-card to-card/50",
        borderClasses[border],
        className
      )}
      {...props}
    >
      {glow && (
        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 hover:opacity-100 transition-opacity duration-500 -z-10" />
      )}
      {children}
    </Card>
  )
}
