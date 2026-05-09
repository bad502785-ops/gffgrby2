"use client"

import { motion } from "framer-motion"
import { Trophy } from "lucide-react"
import { Flag } from "./flag"
import type { Standing } from "@/lib/types"

interface ClassicoPanelProps {
  standings: Standing[]
  roundNumber: number
  connected: boolean
  height: number
}

/**
 * Top bar showing the all-time top 3 winning countries across rounds.
 */
export function ClassicoPanel({ standings, roundNumber, connected, height }: ClassicoPanelProps) {
  const top3 = standings.filter((s) => s.total > 0).slice(0, 3)
  const placeholders = 3 - top3.length

  const colors = [
    { bg: "linear-gradient(135deg,#fde68a,#f59e0b)", text: "#7c2d12", label: "1st" },
    { bg: "linear-gradient(135deg,#e5e7eb,#9ca3af)", text: "#1f2937", label: "2nd" },
    { bg: "linear-gradient(135deg,#f4a572,#a16207)", text: "#3b1d0a", label: "3rd" },
  ]

  return (
    <div
      className="flex w-full items-center justify-between border-b border-amber-700/40 bg-gradient-to-b from-stone-900 via-stone-950 to-black px-5"
      style={{ height }}
    >
      {/* Title */}
      <div className="flex items-center gap-2">
        <Trophy className="h-6 w-6 text-amber-400" />
        <div className="leading-tight">
          <div className="text-[10px] tracking-[0.3em] text-amber-400/80">CLASSICO</div>
          <div className="text-base font-bold text-amber-100">الكلاسيكو · أبطال السباقات</div>
        </div>
      </div>

      {/* Top 3 + placeholders */}
      <div className="flex items-center gap-3">
        {top3.map((s, i) => (
          <motion.div
            key={s.code}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 rounded-lg border px-3 py-1.5"
            style={{
              background: colors[i].bg,
              borderColor: "rgba(0,0,0,0.2)",
              color: colors[i].text,
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
          >
            <span className="text-[10px] font-black tracking-wider opacity-80">
              {colors[i].label}
            </span>
            <Flag code={s.code} width={28} height={18} alt={s.name} />
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold">{s.name}</span>
              <span className="text-[10px] font-mono">
                🥇{s.gold} 🥈{s.silver} 🥉{s.bronze}
              </span>
            </div>
          </motion.div>
        ))}
        {Array.from({ length: placeholders }).map((_, i) => (
          <div
            key={`placeholder-${i}`}
            className="flex items-center gap-2 rounded-lg border border-dashed border-stone-700 px-3 py-1.5 text-stone-600"
          >
            <span className="text-[10px] font-black tracking-wider">
              {colors[top3.length + i].label}
            </span>
            <span className="text-sm">—</span>
          </div>
        ))}
      </div>

      {/* Round + connection */}
      <div className="flex items-center gap-3 text-right">
        <div className="leading-tight">
          <div className="text-[10px] tracking-widest text-amber-400/70">ROUND</div>
          <div className="font-mono text-xl font-bold text-amber-100">#{roundNumber}</div>
        </div>
        <div
          className={`h-2.5 w-2.5 rounded-full ${connected ? "bg-emerald-400" : "bg-rose-500"}`}
          title={connected ? "متصل بالجسر" : "غير متصل"}
          style={{
            boxShadow: connected
              ? "0 0 12px rgba(52,211,153,0.9)"
              : "0 0 12px rgba(244,63,94,0.9)",
          }}
        />
      </div>
    </div>
  )
}
