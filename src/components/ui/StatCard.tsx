"use client"

import { motion }    from "framer-motion"
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react"
import { cn }        from "@/lib/utils"

interface Props {
  title:   string
  value:   string | number
  change?: number
  icon:    LucideIcon
  color:   string
  bg:      string
  index?:  number
}

export default function StatCard({ title, value, change, icon: Icon, color, bg, index = 0 }: Props) {
  const isPositive = (change ?? 0) >= 0
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -2 }}
      className="card p-5 hover:shadow-lg transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn("w-11 h-11 rounded-2xl flex items-center justify-center", bg)}>
          <Icon className={cn("w-5 h-5", color)} />
        </div>
        {change !== undefined && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg",
            isPositive ? "bg-green-500/15 text-green-600 dark:text-green-400"
                       : "bg-red-500/15 text-red-600 dark:text-red-400"
          )}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-[var(--text)] mb-1">{value}</p>
      <p className="text-sm text-[var(--text-muted)]">{title}</p>
    </motion.div>
  )
}