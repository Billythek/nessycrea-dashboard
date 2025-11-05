"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const GlassCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    hover?: boolean
    gradient?: "pink" | "gold" | "mint" | "rose" | "taupe"
  }
>(({ className, hover = true, gradient = "taupe", children, ...props }, ref) => {
  const gradients = {
    pink: "before:bg-gradient-to-br before:from-[#E8C4D8]/20 before:to-transparent",
    gold: "before:bg-gradient-to-br before:from-[#FFD700]/20 before:to-transparent",
    mint: "before:bg-gradient-to-br before:from-[#A8D5BA]/20 before:to-transparent",
    rose: "before:bg-gradient-to-br before:from-[#FFB6C1]/20 before:to-transparent",
    taupe: "before:bg-gradient-to-br before:from-primary/20 before:to-transparent",
  }

  const motionProps = hover
    ? {
        whileHover: { y: -4, scale: 1.02 },
        transition: { type: "spring" as const, stiffness: 300, damping: 20 },
      }
    : {}

  // Extract all HTML props to avoid conflicts with Framer Motion
  const { onDragStart, onDragEnd, onDrag, onDragEnter, onDragLeave, onDragOver, onDrop, ...htmlProps } = props

  return (
    <motion.div
      ref={ref}
      className={cn(
        // Base glassmorphism
        "relative rounded-lg border border-border/50",
        "bg-card/95 backdrop-blur-md",
        "shadow-lg",
        // Gradient overlay
        "before:absolute before:inset-0 before:rounded-lg before:opacity-50",
        gradients[gradient],
        // Hover effects
        hover && "transition-all duration-300 hover:shadow-xl hover:border-primary/30",
        className
      )}
      {...motionProps}
      {...htmlProps}
    >
      {children}
    </motion.div>
  )
})
GlassCard.displayName = "GlassCard"

const GlassCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
GlassCardHeader.displayName = "GlassCardHeader"

const GlassCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
GlassCardTitle.displayName = "GlassCardTitle"

const GlassCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
GlassCardDescription.displayName = "GlassCardDescription"

const GlassCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
GlassCardContent.displayName = "GlassCardContent"

const GlassCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
GlassCardFooter.displayName = "GlassCardFooter"

export { GlassCard, GlassCardHeader, GlassCardFooter, GlassCardTitle, GlassCardDescription, GlassCardContent }
