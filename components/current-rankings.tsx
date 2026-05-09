"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Flag } from "./flag"
import { TARGET_POINTS } from "@/lib/constants"
import type { HorseData } from "@/lib/types"

interface CurrentRankingsProps {
  horses: HorseData[]
  width: number
  height: number
}

/**
 * Side panel showing live race ordering. Top 3 are highlighted, rest scroll.
 */
export function CurrentRankings({ horses, width, height }: CurrentRankingsProps) {
  // Sort: finishers by position first, then by points desc
  const sorted = [...horses].sort((a, b) => {
    if (a.finishPosition !== null && b.finishPosition !== null) {
      return a.finishPosition - b.finishPosition
    }
    if (a.finishPosition !== null) return -1
    if (b.finishPosition !== null) return 1
    return b.points - a.points
  })

  const top3 = sorted.slice(0, 3)
  const rest = sorted.slice(3)

  const medalStyles = [
    { bg: "linear-gradient(135deg,#fde68a,#d97706)", text: "#3b1d0a" },
    { bg: "linear-gradient(135deg,#e5e7eb,#6b7280)", text: "#111827" },
    { bg: "linear-gradient(135deg,#f4a572,#92400e)", text: "#3b1d0a" },
  ]

  return (
    <div
      className="flex flex-col border-l border-amber-700/40 bg-gradient-to-b from-stone-950 to-black"
      style={{ width, height }}
    >
      {/* Header */}
      <div className="border-b border-amber-700/30 bg-black/60 px-3 py-2">
        <div className="text-[10px] tracking-[0.3em] text-amber-400/80">LIVE</div>
        <div className="text-sm font-bold text-amber-100">الترتيب الحالي</div>
      </div>

      {/* Top 3 podium cards */}
      <div className="flex flex-col gap-2 p-3">
        <AnimatePresence initial={false}>
          {top3.map((h, i) => {
            const pct = Math.min(100, (h.points / TARGET_POINTS) * 100)
            return (
              <motion.div
                key={h.code}
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                className="rounded-lg border border-amber-900/40 p-2 shadow-lg"
                style={{
                  background: medalStyles[i].bg,
                  color: medalStyles[i].text,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-lg leading-none">{i + 1}</span>
                    <Flag code={h.code} width={28} height={18} alt={h.name} />
                    <span className="text-sm font-bold">{h.name}</span>
                  </div>
                  <span className="font-mono text-xs font-bold">{pct.toFixed(0)}%</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-black/30">
                  <motion.div
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.4 }}
                    className="h-full rounded-full"
                    style={{
                      background: "linear-gradient(90deg,#fff,rgba(255,255,255,0.6))",
                    }}
                  />
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Rest list */}
      <div className="flex-1 overflow-hidden border-t border-stone-800">
        <div className="px-3 py-1.5 text-[10px] uppercase tracking-widest text-stone-500">
          باقي الترتيب
        </div>
        <div className="overflow-y-auto pr-1" style={{ maxHeight: height - 250 }}>
          <AnimatePresence initial={false}>
            {rest.map((h, idx) => {
              const pct = Math.min(100, (h.points / TARGET_POINTS) * 100)
              return (
                <motion.div
                  key={h.code}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center justify-between px-3 py-1 text-stone-300"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 text-right font-mono text-[10px] text-stone-500">
                      {idx + 4}
                    </span>
                    <Flag code={h.code} width={18} height={12} alt={h.name} />
                    <span className="text-xs">{h.name}</span>
                  </div>
                  <span className="font-mono text-[10px] text-stone-500">
                    {pct.toFixed(0)}%
                  </span>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
