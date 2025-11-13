"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedGradientBgProps {
  className?: string
  variant?: "subtle" | "vibrant"
}

export default function AnimatedGradientBg({
  className,
  variant = "subtle",
}: AnimatedGradientBgProps) {
  const gradients = {
    subtle: [
      "radial-gradient(circle at 20% 30%, rgba(44, 95, 93, 0.08) 0%, transparent 50%)",
      "radial-gradient(circle at 80% 70%, rgba(212, 197, 169, 0.12) 0%, transparent 50%)",
      "radial-gradient(circle at 50% 50%, rgba(205, 163, 101, 0.06) 0%, transparent 50%)",
    ],
    vibrant: [
      "radial-gradient(circle at 20% 30%, rgba(44, 95, 93, 0.15) 0%, transparent 50%)",
      "radial-gradient(circle at 80% 70%, rgba(212, 197, 169, 0.2) 0%, transparent 50%)",
      "radial-gradient(circle at 50% 50%, rgba(205, 163, 101, 0.12) 0%, transparent 50%)",
    ],
  }

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-0 overflow-hidden",
        className
      )}
    >
      {gradients[variant].map((gradient, index) => (
        <motion.div
          key={index}
          className="absolute inset-0"
          style={{
            background: gradient,
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 10 + index * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}
