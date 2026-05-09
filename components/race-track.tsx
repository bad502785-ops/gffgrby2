"use client"

import { motion } from "framer-motion"
import { Horse } from "./horse"
import { Flag } from "./flag"
import { TARGET_POINTS } from "@/lib/constants"
import type { HorseData } from "@/lib/types"

interface RaceTrackProps {
  horses: HorseData[]
  width: number
  height: number
}

const TRACK_PADDING_LEFT = 110 // space for flag + name
const TRACK_PADDING_RIGHT = 60 // space after finish line

export function RaceTrack({ horses, width, height }: RaceTrackProps) {
  const headerH = 36
  const lanesH = height - headerH
  const laneH = lanesH / horses.length
  const runwayWidth = width - TRACK_PADDING_LEFT - TRACK_PADDING_RIGHT

  return (
    <div
      dir="ltr"
      className="relative overflow-hidden"
      style={{
        width,
        height,
        background: "linear-gradient(180deg, #2d1b0e 0%, #3d2817 50%, #2d1b0e 100%)",
      }}
    >
      {/* Header with start/finish labels */}
      <div
        className="relative flex items-center border-b border-amber-900/60"
        style={{ height: headerH, paddingLeft: TRACK_PADDING_LEFT, paddingRight: TRACK_PADDING_RIGHT }}
      >
        <div className="flex w-full items-center justify-between text-xs font-bold tracking-widest text-amber-200/90">
          <span className="rounded bg-amber-900/60 px-2 py-0.5">START</span>
          <span className="text-amber-200/60">سباق الخيول العربي</span>
          <span className="rounded bg-rose-900/70 px-2 py-0.5">FINISH</span>
        </div>
      </div>

      {/* Lanes */}
      <div className="relative" style={{ height: lanesH }}>
        {horses.map((h, i) => {
          const progress = Math.min(1, h.points / TARGET_POINTS)
          // Square horse, slightly taller than its lane so it visually sits on
          // the dashed line and overlaps neighbours like real running animals.
          const horseSize = Math.max(38, Math.min(64, laneH * 1.6))
          const horseW = horseSize
          const horseH = horseSize
          // Position the horse so that when progress=1 its leading edge sits ON the finish line
          const horseLeft = TRACK_PADDING_LEFT + progress * runwayWidth - horseW / 2
          const isFinished = h.finishPosition !== null

          return (
            <div
              key={h.code}
              className="relative flex items-center"
              style={{
                height: laneH,
                background: i % 2 === 0 ? "rgba(0,0,0,0.18)" : "rgba(255,255,255,0.03)",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              {/* Country label (flag + name) */}
              <div
                className="z-10 flex h-full items-center gap-1.5 pl-2"
                style={{ width: TRACK_PADDING_LEFT }}
              >
                <Flag code={h.code} width={22} height={14} alt={h.name} />
                <span
                  className="truncate text-[11px] font-bold leading-tight"
                  style={{ color: h.color, textShadow: "0 1px 2px rgba(0,0,0,0.8)" }}
                  title={h.name}
                >
                  {h.name}
                </span>
              </div>

              {/* Dashed scrolling track line */}
              <div
                className="absolute top-1/2 -translate-y-1/2 track-dashes"
                style={{
                  left: TRACK_PADDING_LEFT,
                  right: TRACK_PADDING_RIGHT,
                  height: 2,
                }}
              />

              {/* Progress bar tint */}
              <div
                className="absolute top-1/2 -translate-y-1/2 rounded-r-full"
                style={{
                  left: TRACK_PADDING_LEFT,
                  width: progress * runwayWidth,
                  height: laneH * 0.55,
                  background: `linear-gradient(90deg, ${h.color}00 0%, ${h.color}55 80%, ${h.color}99 100%)`,
                  pointerEvents: "none",
                }}
              />

              {/* Horse — slightly oversized so hooves rest on the dashed line
                  and the silhouette extends a hair into the neighbouring lane. */}
              <motion.div
                className="absolute z-20"
                style={{
                  top: (laneH - horseH) / 2,
                  width: horseW,
                  height: horseH,
                }}
                animate={{ left: horseLeft }}
                transition={{ type: "spring", stiffness: 90, damping: 18, mass: 0.6 }}
              >
                <Horse state={h.state} width={horseW} height={horseH} />

                {/* Finish position medal */}
                {isFinished && (
                  <div
                    className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-black"
                    style={{
                      background:
                        h.finishPosition === 1
                          ? "linear-gradient(135deg,#ffd700,#b8860b)"
                          : h.finishPosition === 2
                            ? "linear-gradient(135deg,#e6e6e6,#9ca3af)"
                            : "linear-gradient(135deg,#cd7f32,#7c4a1e)",
                      color: "#1a1a1a",
                      boxShadow: "0 0 10px rgba(255,215,0,0.6)",
                    }}
                  >
                    {h.finishPosition}
                  </div>
                )}
              </motion.div>

              {/* Points pill */}
              <div
                className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-mono font-bold text-amber-200"
                style={{ width: TRACK_PADDING_RIGHT - 8, textAlign: "center" }}
              >
                {Math.round(progress * 100)}%
              </div>
            </div>
          )
        })}
      </div>

      {/* Start line (left) */}
      <div
        className="pointer-events-none absolute z-0"
        style={{
          left: TRACK_PADDING_LEFT - 2,
          top: headerH,
          bottom: 0,
          width: 4,
          background:
            "repeating-linear-gradient(0deg,#fff 0 8px,#000 8px 16px)",
          opacity: 0.85,
        }}
      />

      {/* Finish line (right, checkered) */}
      <div
        className="pointer-events-none absolute z-0"
        style={{
          right: TRACK_PADDING_RIGHT - 4,
          top: headerH,
          bottom: 0,
          width: 8,
          background:
            "repeating-conic-gradient(#fff 0% 25%,#111 0% 50%) 50% / 8px 8px",
          boxShadow: "0 0 20px rgba(255,255,255,0.3)",
        }}
      />
    </div>
  )
}
