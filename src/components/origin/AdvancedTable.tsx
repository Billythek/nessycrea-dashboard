"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface AdvancedTableProps extends React.HTMLAttributes<HTMLTableElement> {
  striped?: boolean
  hover?: boolean
  compact?: boolean
}

export function AdvancedTable({
  className,
  striped = false,
  hover = true,
  compact = false,
  children,
  ...props
}: AdvancedTableProps) {
  return (
    <div className="rounded-md border bg-card overflow-hidden">
      <Table
        className={cn(
          compact && "[&_td]:py-2 [&_th]:py-2",
          className
        )}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === TableBody) {
            return React.cloneElement(child as React.ReactElement, {
              children: React.Children.map(child.props.children, (row, index) => {
                if (React.isValidElement(row) && row.type === TableRow) {
                  const rowElement = row as React.ReactElement<{ className?: string }>
                  return React.cloneElement(rowElement, {
                    className: cn(
                      rowElement.props.className,
                      hover && "hover:bg-muted/50 transition-colors",
                      striped && index % 2 === 0 && "bg-muted/30"
                    ),
                  })
                }
                return row
              }),
            })
          }
          return child
        })}
      </Table>
    </div>
  )
}

// Composant wrapper pour TableRow avec styles am?lior?s
export function EnhancedTableRow({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <TableRow
      className={cn(
        "transition-colors hover:bg-muted/50",
        className
      )}
      {...props}
    />
  )
}
