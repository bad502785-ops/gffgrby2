"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Trophy } from "lucide-react"
import { Flag } from "./flag"
import type { HorseData } from "@/lib/types"

interface WinnerModalProps {
  winners: HorseData[] | null
}

const PODIUM = [
  {
    label: "1st",
    badge: "ذهبية",
    bg: "linear-gradient(135deg,#fde68a,#f59e0b 60%,#b45309)",
    text: "#3b1d0a",
    height: 140,
    medal: "🥇",
  },
  {
    label: "2nd",
    badge: "فضية",
    bg: "linear-gradient(135deg,#f4f4f5,#9ca3af 60%,#52525b)",
    text: "#1f2937",
    height: 110,
    medal: "🥈",
  },
  {
    label: "3rd",
    badge: "برونزية",
    bg: "linear-gradient(135deg,#f4a572,#a16207 60%,#78350f)",
    text: "#1f1209",
    height: 90,
    medal: "🥉",
  },
]

/**
 * Big celebratory overlay showing the round's top 3 finishers on a podium.
 * Visible for WINNER_DISPLAY_MS, then the engine resets the round.
 */
export function WinnerModal({ winners }: WinnerModalProps) {
  return (
    <AnimatePresence>
      {winners && winners.length >= 3 && (
        <motion.div
          key="winner-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex items-center justify-center"
          style={{
            background:
              "radial-gradient(ellipse at 50% 30%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.85) 70%, rgba(0,0,0,0.95) 100%)",
            backdropFilter: "blur(2px)",
          }}
        >
          {/* Spinning rays */}
          <div
            aria-hidden
            className="absolute"
            style={{
              width: 900,
              height: 900,
              background:
                "conic-gradient(from 0deg, rgba(251,191,36,0) 0deg, rgba(251,191,36,0.18) 10deg, rgba(251,191,36,0) 20deg, rgba(251,191,36,0.18) 30deg, rgba(251,191,36,0) 40deg, rgba(251,191,36,0.18) 50deg, rgba(251,191,36,0) 60deg)",
              animation: "rays-spin 14s linear infinite",
              maskImage:
                "radial-gradient(circle, rgba(0,0,0,0.7) 30%, transparent 70%)",
            }}
          />

          <div className="relative flex flex-col items-center gap-5 px-6">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-3 rounded-full border border-amber-500/60 bg-black/60 px-6 py-2"
            >
              <Trophy className="h-7 w-7 text-amber-300" />
              <span className="text-xl font-black tracking-wider text-amber-100">
                نتيجة السباق
              </span>
              <Trophy className="h-7 w-7 text-amber-300" />
            </motion.div>

            {/* Podium */}
            <div className="flex items-end gap-4">
              {/* Order podium visually 2 - 1 - 3 */}
              {[1, 0, 2].map((idx) => {
                const w = winners[idx]
                if (!w) return null
                const cfg = PODIUM[idx]
                return (
                  <motion.div
                    key={w.code + idx}
                    initial={{ y: 60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 + idx * 0.15, type: "spring" }}
                    className="flex flex-col items-center"
                  >
                    <div className="mb-2 flex flex-col items-center gap-1">
                      <span className="text-3xl drop-shadow-lg">
                        {cfg.medal}
                      </span>
                      <Flag
                        code={w.code}
                        width={56}
                        height={36}
                        alt={w.name}
                      />
                      <span
                        className="text-base font-black"
                        style={{
                          color: w.color,
                          textShadow: "0 2px 6px rgba(0,0,0,0.9)",
                        }}
                      >
                        {w.name}
                      </span>
                    </div>
                    <div
                      className="flex w-32 flex-col items-center justify-center rounded-t-lg border-x-2 border-t-2 border-black/40 px-3 pb-3 pt-2 shadow-2xl"
                      style={{
                        height: cfg.height,
                        background: cfg.bg,
                        color: cfg.text,
                      }}
                    >
                      <span className="text-2xl font-black tracking-wider">
                        {cfg.label}
                      </span>
                      <span className="text-[11px] font-bold opacity-80">
                        ميدالية {cfg.badge}
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-xs tracking-widest text-amber-200/80"
            >
              جولة جديدة بعد لحظات…
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
