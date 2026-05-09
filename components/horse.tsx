"use client"

import type { HorseState } from "@/lib/types"

interface HorseProps {
  state: HorseState
  /** Horizontal display size in px */
  width?: number
  /** Vertical display size in px */
  height?: number
  /** 1..6 — picks which horse GIF to use so all 22 lanes feel unique */
  variant?: number
}

/**
 * Renders a single galloping horse using the GIFs from Horse-Race-main.
 *   horse1.gif … horse6.gif (each is its own animated gallop loop).
 *
 * The GIF itself supplies the gallop animation. State is reflected by a
 * subtle CSS bounce + scale on the wrapper:
 *   idle    → gentle trot bounce
 *   comment → normal run bounce
 *   boost   → fast sprint bounce + slight scale-up
 */
export function Horse({ state, width = 80, height = 50, variant = 1 }: HorseProps) {
  const v = ((variant - 1) % 6) + 1
  const src = `/horses/horse${v}.gif`

  const animationName =
    state === "boost"
      ? "horse-bounce-boost"
      : state === "comment"
        ? "horse-bounce-run"
        : "horse-bounce-idle"

  const duration = state === "boost" ? "0.18s" : state === "comment" ? "0.32s" : "0.6s"

  return (
    <div
      aria-hidden
      className="horse-gif-wrapper"
      style={{
        width,
        height,
        animation: `${animationName} ${duration} ease-in-out infinite`,
      }}
    >
      <img
        src={src || "/placeholder.svg"}
        alt=""
        width={width}
        height={height}
        draggable={false}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          filter:
            state === "boost"
              ? "drop-shadow(0 2px 4px rgba(0,0,0,0.6)) saturate(1.2) brightness(1.1)"
              : "drop-shadow(0 2px 3px rgba(0,0,0,0.5))",
          imageRendering: "auto",
          userSelect: "none",
          pointerEvents: "none",
        }}
      />
    </div>
  )
}
