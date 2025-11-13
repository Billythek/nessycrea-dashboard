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
      "radial-gradient(circle at 20% 30%, rgba(33, 128, 141, 0.04) 0%, transparent 50%)",
      "radial-gradient(circle at 80% 70%, rgba(107, 83, 68, 0.03) 0%, transparent 50%)",
      "radial-gradient(circle at 50% 50%, rgba(168, 75, 47, 0.03) 0%, transparent 50%)",
    ],
    vibrant: [
      "radial-gradient(circle at 20% 30%, rgba(33, 128, 141, 0.08) 0%, transparent 50%)",
      "radial-gradient(circle at 80% 70%, rgba(107, 83, 68, 0.06) 0%, transparent 50%)",
      "radial-gradient(circle at 50% 50%, rgba(168, 75, 47, 0.05) 0%, transparent 50%)",
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
