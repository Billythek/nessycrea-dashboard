"use client"

import { cn } from "@/lib/utils"

interface HighlightTextProps {
  text: string
  highlight?: string | string[]
  className?: string
  highlightClassName?: string
}

export function HighlightText({
  text,
  highlight,
  className,
  highlightClassName = "bg-primary/20 text-primary font-semibold px-1 rounded",
}: HighlightTextProps) {
  if (!highlight) {
    return <span className={className}>{text}</span>
  }

  const highlights = Array.isArray(highlight) ? highlight : [highlight]
  const parts: { text: string; isHighlight: boolean }[] = []
  let lastIndex = 0

  // Trouver toutes les occurrences des mots ? mettre en ?vidence
  const matches: { index: number; length: number }[] = []
  
  highlights.forEach((h) => {
    const regex = new RegExp(h, "gi")
    let match
    while ((match = regex.exec(text)) !== null) {
      matches.push({ index: match.index, length: match[0].length })
    }
  })

  // Trier par index
  matches.sort((a, b) => a.index - b.index)

  // Cr?er les parties du texte
  matches.forEach((match) => {
    if (match.index > lastIndex) {
      parts.push({
        text: text.substring(lastIndex, match.index),
        isHighlight: false,
      })
    }
    parts.push({
      text: text.substring(match.index, match.index + match.length),
      isHighlight: true,
    })
    lastIndex = match.index + match.length
  })

  if (lastIndex < text.length) {
    parts.push({
      text: text.substring(lastIndex),
      isHighlight: false,
    })
  }

  if (parts.length === 0) {
    return <span className={className}>{text}</span>
  }

  return (
    <span className={className}>
      {parts.map((part, index) =>
        part.isHighlight ? (
          <span key={index} className={highlightClassName}>
            {part.text}
          </span>
        ) : (
          <span key={index}>{part.text}</span>
        )
      )}
    </span>
  )
}
