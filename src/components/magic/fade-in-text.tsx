"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface FadeInTextProps {
  text: string
  className?: string
  delay?: number
  duration?: number
}

export default function FadeInText({
  text,
  className,
  delay = 0,
  duration = 0.5,
}: FadeInTextProps) {
  const words = text.split(" ")

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: delay },
    }),
  }

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
  }

  return (
    <motion.div
      className={cn("flex flex-wrap", className)}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, index) => (
        <motion.span
          variants={child}
          key={index}
          className="mr-1"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  )
}
