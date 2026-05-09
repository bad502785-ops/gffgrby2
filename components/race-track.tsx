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

const TRACK_PADDING_LEFT = 16 // small inner margin (label sits ON the lane behind the horse)
const TRACK_PADDING_RIGHT = 50 // space for the finish line + percent pill

/**
 * The track inspired by Horse-Race-main: warm desert sand background with a
 * thick black border, and each horse gallops across its own lane.
 * The tribe / country label is rendered on the lane (behind the horse) so
 * viewers can clearly tell who is who without looking at the side panel.
 */
export function RaceTrack({ horses, width, height }: RaceTrackProps) {
  const headerH = 32
  const lanesH = height - headerH
  const laneH = lanesH / horses.length
  const runwayWidth = width - TRACK_PADDING_LEFT - TRACK_PADDING_RIGHT

  // Horse should be a touch taller than the lane so hooves overlap the
  // dashed line — exactly like the source Horse-Race-main layout.
  const horseH = Math.max(28, Math.min(56, laneH * 1.25))
  const horseW = horseH * 1.6 // GIFs are 400x250 → 1.6:1 aspect

  return (
    <div
      dir="ltr"
      className="relative overflow-hidden"
      style={{
        width,
        height,
        // Outer desert sand frame matches Horse-Race-main (#B6771D)
        background: "#B6771D",
        borderRight: "4px solid #000",
        borderTop: "4px solid #000",
        borderBottom: "4px solid #000",
      }}
    >
      {/* Inner sand track plate — the lighter "race plate" from Horse-Race-main (#D9A066) */}
      <div
        className="relative h-full w-full"
        style={{
          background:
            "linear-gradient(180deg,#E2B07A 0%,#D9A066 50%,#C28A4F 100%)",
        }}
      >
        {/* Header with start/finish labels */}
        <div
          className="relative flex items-center border-b-2 border-black/40"
          style={{
            height: headerH,
            paddingLeft: TRACK_PADDING_LEFT,
            paddingRight: TRACK_PADDING_RIGHT,
            background:
              "linear-gradient(180deg,rgba(0,0,0,0.18) 0%,rgba(0,0,0,0.04) 100%)",
          }}
        >
          <div className="flex w-full items-center justify-between text-[11px] font-black tracking-widest text-stone-900">
            <span className="rounded bg-amber-900 px-2 py-0.5 text-amber-100">
              START
            </span>
            <span className="text-stone-800/80">سباق الخيول العربي</span>
            <span className="rounded bg-rose-900 px-2 py-0.5 text-rose-100">
              FINISH
            </span>
          </div>
        </div>

        {/* Lanes */}
        <div className="relative" style={{ height: lanesH }}>
          {horses.map((h, i) => {
            const progress = Math.min(1, h.points / TARGET_POINTS)
            // Position the horse so that when progress=1 the leading edge
            // sits exactly on the finish line column.
            const horseLeft =
              TRACK_PADDING_LEFT + progress * runwayWidth - horseW / 2
            const isFinished = h.finishPosition !== null
            // Cycle through 6 GIFs so every lane has visual variety.
            const variant = (i % 6) + 1

            return (
              <div
                key={`${h.code}-${i}`}
                className="relative flex items-center"
                style={{
                  height: laneH,
                  // Alternating sand stripes for readability with 22 lanes.
                  background:
                    i % 2 === 0 ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.05)",
                  borderBottom: "1px solid rgba(0,0,0,0.18)",
                }}
              >
                {/* Tribe / country label — sits ON the lane, BEHIND the horse */}
                <div
                  className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center gap-1.5 pl-1.5"
                  style={{ width: 130 }}
                >
                  <Flag code={h.code} width={Math.min(22, laneH * 0.7)} height={Math.min(14, laneH * 0.45)} alt={h.name} />
                  <span
                    className="truncate text-[11px] font-extrabold leading-none"
                    style={{
                      color: h.color,
                      WebkitTextStroke: "0.6px rgba(0,0,0,0.55)",
                      textShadow:
                        "0 1px 0 rgba(255,255,255,0.35), 0 2px 3px rgba(0,0,0,0.55)",
                      fontSize: Math.max(10, Math.min(13, laneH * 0.42)),
                    }}
                    title={h.name}
                  >
                    {h.name}
                  </span>
                </div>

                {/* Dashed scrolling track line — like the desert lane line */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 track-dashes"
                  style={{
                    left: TRACK_PADDING_LEFT,
                    right: TRACK_PADDING_RIGHT,
                    height: 2,
                  }}
                />

                {/* Progress tint — colored trail behind the horse */}
                <div
                  className="absolute top-1/2 -translate-y-1/2"
                  style={{
                    left: TRACK_PADDING_LEFT,
                    width: progress * runwayWidth,
                    height: laneH * 0.5,
                    background: `linear-gradient(90deg, ${h.color}00 0%, ${h.color}55 75%, ${h.color}aa 100%)`,
                    borderRadius: "0 999px 999px 0",
                    pointerEvents: "none",
                  }}
                />

                {/* Horse */}
                <motion.div
                  className="absolute z-20"
                  style={{
                    top: (laneH - horseH) / 2,
                    width: horseW,
                    height: horseH,
                  }}
                  animate={{ left: horseLeft }}
                  transition={{
                    type: "spring",
                    stiffness: 90,
                    damping: 18,
                    mass: 0.6,
                  }}
                >
                  <Horse
                    state={h.state}
                    width={horseW}
                    height={horseH}
                    variant={variant}
                  />

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
                        boxShadow: "0 0 10px rgba(255,215,0,0.7)",
                      }}
                    >
                      {h.finishPosition}
                    </div>
                  )}
                </motion.div>

                {/* Points pill */}
                <div
                  className="pointer-events-none absolute right-1 top-1/2 z-30 -translate-y-1/2 rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-mono font-bold text-amber-200"
                  style={{ width: TRACK_PADDING_RIGHT - 8, textAlign: "center" }}
                >
                  {Math.round(progress * 100)}%
                </div>
              </div>
            )
          })}
        </div>

        {/* Finish line (right side, white pillar like in Horse-Race-main) */}
        <div
          className="pointer-events-none absolute z-0"
          style={{
            right: TRACK_PADDING_RIGHT - 5,
            top: headerH,
            bottom: 0,
            width: 5,
            background: "#fff",
            boxShadow:
              "0 0 12px rgba(255,255,255,0.8), inset 0 0 0 1px rgba(0,0,0,0.4)",
          }}
        />
      </div>
    </div>
  )
}
